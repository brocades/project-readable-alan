import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom'
import { If, Then } from 'react-if'
import '../App.css';
import CategoryPosts from './CategoryPosts'
import PostDetails from './PostDetails'
import PostSubmit from './PostSubmit'
import NoMatch from './NoMatch'
import { connect } from 'react-redux'
import { openSubmitModal, closeSubmitModal, initializeAppPosts, initializeAppComments, initializeAppCategories, orderBy } from '../actions'

class App extends Component {

  controlSelectedCategory = (selectedCategory) => {
    const categoryItems = document.getElementsByClassName("category-item")

    for (let item of categoryItems) {
      item.classList.remove("category-item-selected")
      if (selectedCategory === item.id) {
        item.classList.add("category-item-selected")
      }
    }
  }

  timestamp = (itemA, itemB) => {
    const valueB = itemB.timestamp
    const valueA = itemA.timestamp
    if (valueB < valueA)
      return 1
    if (valueB > valueA)
      return -1
    return 0
  }

  voteScore = (itemA, itemB) => {
    const valueB = itemB.voteScore
    const valueA = itemA.voteScore
    if (valueB > valueA)
      return 1
    if (valueB < valueA)
      return -1
    return 0
  }

  controlSelectedAction = (selectedAction) => {
    const actionItems = document.getElementsByClassName("action-button")

    for (let action of actionItems) {
      action.classList.remove("action-button-selected")
      if (selectedAction === action.id) {
        action.classList.add("action-button-selected")
      }
    }
  }

  initializeApp() {
    this.props.initializeAppPosts()
    this.props.initializeAppComments()
    this.props.initializeAppCategories()
    this.controlSelectedCategory("all")
    this.controlSelectedAction("timestamp")
  }

  selectCategory = (categoryName) => {
    this.controlSelectedCategory(categoryName)
  }

  selectAction = (actionId) => {
    this.controlSelectedAction(actionId)
  }

  getCategories = () => {
    let categories = [
      {
        path: "loading",
        name: "loading"
      },
      {
        path: "loading",
        name: "loading"
      }
    ]
    if (this.props.categories.length > 0)
      categories = this.props.categories
    return categories
  }

  getPostDetails = (id) => {
    for (let post of this.props.posts)
      if (post.id === id) return post
  }

  componentDidMount() {
    this.initializeApp()
  }

  render() {
    let categories = this.getCategories()
    return (
      <div className="App">

        <header>
          <h1 className="app-title">Readable App</h1>
        </header>

        <div className="app-content">
          <section className="categories-section">
            <section className="categories-wrapper">
              <h2 className="category-title">Categories</h2>
                <section className="category-types">
                  {categories.map((category, key) => (
                      <Link key={key} to={`/${category.name !== 'all' ? category.name : ''}`}>
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

            
          <section className="posts-section">

            <section className="app-post-header">
              <h2 className="posts-title">Discussion</h2>
            </section>

            <Switch>
              <Route key="category-post" exact path="/:category/:id" render={({ match }) => (
                <PostDetails
                key={match.params.id}
                post={this.getPostDetails(match.params.id)}/>
              )}/>
              <Route key="all" exact path="/" render={() => <CategoryPosts category="all"/>}/>
              <Route key="react" exact path="/react" render={() => <CategoryPosts category="react"/>}/>
              <Route key="redux" exact path="/redux" render={() => <CategoryPosts category="redux"/>}/>
              <Route key="udacity" exact path="/udacity" render={() => <CategoryPosts category="udacity"/>}/>
              <Route component={NoMatch} />
            </Switch>
          </section>


          <section className="actions-section">
            <section className="actions-wrapper">
              <h2> Actions </h2>
              <button
                className="action-button"
                onClick={this.props.openSubmitModal}>
              Add
              </button>

              <h2> Order by </h2>

              <button
                id="timestamp"
                className="action-button"
                onClick={() => {
                  this.props.orderBy(this.timestamp)
                  this.selectAction("timestamp")
                }}>
              Timestamp
              </button>

              <button
                id="votescore"
                className="action-button"
                onClick={() => {
                  this.props.orderBy(this.voteScore)
                  this.selectAction("votescore")
                }}>
              VoteScore
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

const mapDispatchToProps = {
  openSubmitModal,
  closeSubmitModal,
  initializeAppPosts,
  initializeAppComments,
  initializeAppCategories,
  orderBy,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
