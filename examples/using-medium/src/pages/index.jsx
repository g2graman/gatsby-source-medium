import React, {Component} from "react"

const mediumCDNUrl = `https://cdn-images-1.medium.com/max/150/`;
const getMediumImageSrc = (post) => `${mediumCDNUrl}/${post.node.virtuals.previewImage.imageId}`;

export default class IndexPage extends Component {
  constructor (props) {
      super(props);
  }

  render () {
      const posts = this.props.data.allMediumPost.edges;
      console.log(posts);

      return (
          <main>
              {
                  posts.map(post => (
                      <article key={post.node.id}>
                        <h2>{post.node.title}</h2>
                        <h3>by {post.node.author.name}</h3>
                        <img
                            src={getMediumImageSrc(post)}
                            alt={post.node.title}
                            width="150"
                        />
                      </article>
                  ))
              }
          </main>
      );
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    allMediumPost(limit: 5, sort: { fields: [createdAt], order: DESC }) {
      edges {
        node {
          id
          slug
          title
          createdAt
          virtuals {
            subtitle
            previewImage {
              imageId
            }
          }
          author {
            name
          }
        }
      }
    }
  }`;
