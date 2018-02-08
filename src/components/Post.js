import React, { Component } from 'react'
import { If, Then, Else } from 'react-if'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../post.css'
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'
import serializeForm from 'form-serialize'
import { connect } from 'react-redux'
import { updatePost, removePost, voteOnPost, deleteComment } from '../actions'
const uuidv1 = require('uuid/v1');

class Post extends Component {

	state = {
		editting: false,
	}

	handlePostUpdate = (e) => {
		e.preventDefault()
		const inputValues = serializeForm(e.target, { hash: true })
		let post = Object.assign({}, this.props.post, inputValues)
		this.props.updatePost(post)
		this.toggleEditting()
	}

	deletePost = (id) => {
		this.props.deletePost(id)
		for (let comment of this.props.post.comments) {
			this.props.deleteComment(comment.id)
		}
	}

	upVotePost = (id) => {
		const option = "upVote"
		this.props.votePost({ id, option })
	}

	downVotePost = (id) => {
		const option = "downVote"
		this.props.votePost({ id, option })
	}

	isEditting() {
		return this.state.editting
	}

	toggleEditting() {
		this.setState({ editting: !this.state.editting })
	}

	getValidCategories() {
		const categories = this.props.categories
		const categoriesList = [ ...categories]
		return categoriesList.slice(1)
	}

	getPostProps() {
		let props = {
			id: null,
			voteScore: null,
			title: null,
			author: null,
			body: null,
			category: null,
			comments: []
		}
		if (this.props.post)
			props = this.props.post
		return props
	}

	componentDidMount() {

	}

	render() {
		const { id, voteScore, title, author, body, category, commentCount, comments } = this.getPostProps()
		const categories = this.getValidCategories()
		const type = this.props.type
		return (
			<section id={id} className="post">
				<If condition={this.isEditting() === false}>
					<Then>
						<section className="post-wrapper">
							<section className="post-vote-score-section">
								<FaAngleUp className="post-action-button" onClick={() => this.upVotePost(id)}/>
									<p className="post-vote-score">{voteScore}</p>
								<FaAngleDown className="post-action-button" onClick={() => this.downVotePost(id)}/>
							</section>
							<section className="post-section">
								<section className="post-title">
									<section className="post-title-texts">
										<Link
													to={`/${category}/${id}`}><h3>{title}</h3>
										</Link>
										<h4>by </h4><h3>{author}</h3>
									</section>

									<section className="post-comments-count">
										<h4>{commentCount} comments</h4>
									</section>

									<section className="post-title-buttons">
										<div className="edit-button post-action-button" onClick={() => this.toggleEditting()}>
											<FaEdit/>
										</div>
										<Link onClick={() => this.deletePost(id)} to="/">
											<div className="delete-button post-action-button">
												<FaClose/>
											</div>
										</Link>
									</section>
								</section>
								<section className="post-body">
									<p className="post-body-text">{body}</p>

								</section>
								<section id="commentsSection" className="collapse-comments">
									<If condition={comments instanceof Array}>
										<Then>
											<section className="comments-wrapper">
												{comments
													.filter((comment) => !comment.deleted)
													.map((comment) => (
														<Comment
															type="details"
															parentId={id}
															key={comment.id}
															comment={comment}/>
													))}
											</section>
										</Then>
										<Else>
											<p>Be the first to comment!</p>
										</Else>
									</If>
								</section>
							</section>
						</section>
					</Then>
					<Else>
						<form className="post-form" onSubmit={this.handlePostUpdate}>
							<section className="post-wrapper">
								<section className="post-edit-section">
									<section className="post-header">
										<section className="post-edit-title-texts">
											<input required
												className="post-title-input"
												type="text"
												name="title"
												defaultValue={title}/>

											<h4>by</h4>

											<input required
												className="post-author-input"
												type="text"
												name="author"
												defaultValue={author}/>

											<select
												className="post-category-input"
												defaultValue={category}
												name="category">
												{categories.map((category, index) => (
														<option
															key={index}
															value={category.name}>{category.name}</option>
													))}
											</select>
										</section>

										<section className="post-title-buttons">
											<div className="cancel-button post-action-button" onClick={() => this.toggleEditting()}>
												<FaBan/>
											</div>
										</section>
									</section>

									<section className="post-body">
										<textarea required
											className="post-body-input"
											name="body"
											defaultValue={body}>
										</textarea>
										<button className="post-input-button" type="submit">
										Send
										</button>
									</section>

									<section id="commentsSection" className="collapse-comments">
										<If condition={comments instanceof Array}>
											<Then>
												<section className="comments-wrapper">
													{comments
														.filter((comment) => !comment.deleted)
														.map((comment) => (
															<Comment
																type="details"
																parentId={id}
																key={comment.id}
																comment={comment}/>
														))}
												</section>
											</Then>
											<Else>
												<p>Be the first to comment!</p>
											</Else>
										</If>
									</section>
								</section>
							</section>
						</form>
					</Else>
				</If>
			</section>
		)
	}
}

function mapStateToProps({ post }) {
	return {
		categories: post.categories
	}
}

function mapDispatchToProps(dispatch) {
	return {
		updatePost: (data) => dispatch(updatePost(data)),
		deletePost: (data) => dispatch(removePost(data)),
		votePost: (data) => dispatch(voteOnPost(data)),
		deleteComment: (data) => dispatch(deleteComment(data)),
	}
}

Post.propTypes = {
	title: PropTypes.string,
	author: PropTypes.string,
	body: PropTypes.string,
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)