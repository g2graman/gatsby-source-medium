const axios = require(`axios`);
const crypto = require(`crypto`);

const fetch = username => {
  const url = `https://medium.com/${username}/latest?format=json`;
  return axios.get(url);
};

const prefix = `])}while(1);</x>`;

const strip = payload => payload.replace(prefix, ``);

const makeLinksFromResourceAndPosts = (resource, posts) => {
    return resource.type === `Post`
            ? {
                author___NODE: resource.creatorId,
            }
            : resource.type === `User`
            ? {
                posts___NODE: posts
                    .filter(post => post.creatorId === resource.userId)
                    .map(post => post.id),
            }
            : {};
};

const calculateDigestFromResource = (resource) => {
    return crypto
        .createHash(`md5`)
        .update(JSON.stringify(resource))
        .digest(`hex`);
};

const makeNodeFromResource = (resource, posts, user) => {
    return {
        ... resource,
        id: resource.id
            ? resource.id
            : resource.userId,
        parent: `__SOURCE__`,
        children: [],
        internal: {
            type: `Medium${resource.type}`,
            contentDigest: calculateDigestFromResource(resource),
        },
        links: makeLinksFromResourceAndPosts(resource, posts),
        author: user
    };
};

exports.sourceNodes = async ({ boundActionCreators }, { username }) => {
  const { createNode } = boundActionCreators;

  try {
    const result = await fetch(username);
    const json = JSON.parse(strip(result.data));

    const posts = Object.values(json.payload.references.Post);
    const user = json.payload.references.User[json.payload.user.userId];

    const importableResources = [
        posts,
        [user]
    ];

    const resources = Array.prototype.concat(...importableResources); // flatten importable resource arrays

    return resources.map(resource => {
        console.log(createNode(
            makeNodeFromResource(resource, posts, user)
        ));

      return createNode(
          makeNodeFromResource(resource, posts, user)
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
};
