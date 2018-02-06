import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom'
import { If, Then, Else } from 'react-if'
import '../App.css';
import Post from './Post'
import CategoryPosts from './CategoryPosts'
import PostDetails from './PostDetails'
import PostSubmit from './PostSubmit'
import * as ReadableAPI from '../ReadableAPI'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { openSubmitModal, closeSubmitModal, initializeAppPosts, initializeAppComments, orderBy } from '../actions'

class App extends Component {

  controlSelectedColor = (selectedCategory) => {
    const categoryItems = document.getElementsByClassName("category-item")

    for (let item of categoryItems) {
        item.classList.remove("category-item-selected")
      if (selectedCategory === item.id) {
        item.classList.add("category-item-selected")
      }
    }
  }

  initializeApp() {
    this.props.initializeAppPosts()
    this.props.initializeAppComments()
    this.controlSelectedColor("all")
  }

  sortByTimestamp = (itemA, itemB) => {
    const valueB = itemB.timestamp
    const valueA = itemA.timestamp
    if (valueB > valueA)
      return 1
    if (valueB < valueA)
      return -1
    return 0
  }

  sortByVoteScore = (itemA, itemB) => {
    const valueB = itemB.voteScore
    const valueA = itemA.voteScore
    if (valueB > valueA)
      return 1
    if (valueB < valueA)
      return -1
    return 0
  }


  selectCategory = (categoryName) => {
    this.controlSelectedColor(categoryName)
  }

  getCategoryPosts = (categoryName) => {
    if (categoryName !== "all") {
      ReadableAPI.getCategoryPosts(categoryName).then((posts) => {
        this.setState({ posts })
      })
    } else {
      ReadableAPI.getAllPosts().then((posts) => {
        this.setState({ posts })
      })
    }
  }

  getAllPosts = () => {
    ReadableAPI.getAllPosts().then((posts) => {
      this.props.initializeAppPosts(posts)
    })
  }

  getAllComments = () => {
    ReadableAPI.getAllComments().then((comments) => {
      this.props.initializeComments(comments)
    })
  }

  getPostComments = (post) => {
    ReadableAPI.getPostComments(post).then((comments) => {

    })
  }
  getCategories = () => {
    ReadableAPI.getCategories().then((categories) => {
      this.setState({ categories })
    })
  }

  getPostDetails = (id) => {
    for (let post of this.props.posts)
      if (post.id === id) return post
  }

  componentDidMount() {
    this.initializeApp()
    //this.getCategoryPosts(this.state.category)
    //this.getPost(this.state.post)
    //this.getAllPosts()
    //this.getPostComments(this.state.post)
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" render={() => (
          <Redirect to="/all"/>
        )}/>

        <header>
          <h1 className="app-title">Readable App</h1>
        </header>

        <div className="app-content">
          <section className="categories-section">
            <section className="categories-wrapper">
              <h2 className="category-title">Categories</h2>
                <section className="category-types">
                  {this.props.categories.map((category) => (
                      <Link to={`/${category.name}`}>
                        <button
                          className="category-item"
                          id={category.name}
                          key={category.name}
                          onClick={() => this.selectCategory(category.name)}>
                          {category.name}
                        </button>
                      </Link>
                    ))}
                </section>
            </section>
          </section>
          <Route exact path="/:category" render={() => (
            <section className="posts-section">
              <section className="app-post-header">
                <h2 className="posts-title">Discussion</h2>
              </section>
              {this.props.categories.map((category) => (
                <Route key={category.path} exact path={`/${category.path}`} render={() => (
                  <CategoryPosts category={category.name}/>
                  )}/>
                ))}
            </section>
          )}/>

          <Route exact path="/:category/:id" render={({ match }) => (
            <PostDetails
              key={match.params.id}
              post={this.getPostDetails(match.params.id)}/>
          )}/>

          <section className="actions-section">
            <section className="actions-wrapper">
              <h2> Actions </h2>
              <button onClick={this.props.openSubmitModal}>
              Add
              </button>

              <button onClick={() => this.props.orderItems(this.sortByTimestamp)}>
                Sort by timestamp
              </button>

              <button onClick={() => this.props.orderItems(this.sortByVoteScore)}>
                Sort by voteScore
              </button>
            </section>
          </section>

        </div>

        <If condition={this.props.submitModal}>
          <Then>
            <PostSubmit />
          </Then>
        </If>

        <footer></footer>
      </div>
    )
  }
}

function mapStateToProps({ post, comment }) {
  const allComments = Object.keys(comment.comments).map(key => comment.comments[key])

  return {
    posts: Object.values(post.posts).reduce((postsArray, singlePost) => {
      postsArray.push({
        ...singlePost,
        comments: allComments.filter(singleComment => singleComment.parentId === singlePost.id)
      })
      return postsArray
    }, []),
    categories: post.categories,
    submitModal: post.submitModal,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openSubmitModal: () => dispatch(openSubmitModal()),
    closeSubmitModal: () => dispatch(closeSubmitModal()),
    initializeAppPosts: () => dispatch(initializeAppPosts()),
    initializeAppComments: () => dispatch(initializeAppComments()),
    orderItems: (data) => dispatch(orderBy(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
