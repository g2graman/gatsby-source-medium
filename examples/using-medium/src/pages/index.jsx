import React, {Component} from "react";

const mediumCDNUrl = `https://cdn-images-1.medium.com/max/150/`;
const getMediumImageSrc = (post) => `${mediumCDNUrl}/${post.node.virtuals.previewImage.imageId}`;
const getPostImageCount = (post) => post.node.virtuals.imageCount;

export default class IndexPage extends Component {
  constructor (props) {
      super(props);
  }

  render () {
      const posts = this.props.data.allMediumPost.edges;

      return (
          <main>
              {
                  posts.map(post => (
                      <article key={post.node.id}>
                        <h2>{post.node.title}</h2>
                        <h3>by {post.node.author.name}</h3>
                          {
                              getPostImageCount(post) > 0
                                ? (
                                      <img
                                          src={getMediumImageSrc(post)}
                                          alt={post.node.title}
                                          width="150"
                                      />
                                  ) : (
                                      null
                                  )
                          }
                      </article>
                  ))
              }
          </main>
      );
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    allMediumPost(limit: 5) {
      edges {
        node {
          id
          slug
          title
          virtuals {
            subtitle
            previewImage {
              imageId
            }
            imageCount
          }
          author {
            name
          }
        }
      }
    }
  }`;
