import React, { Component } from 'react'
import { If, Then, Else } from 'react-if'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../post.css'
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'
import serializeForm from 'form-serialize'
const uuidv1 = require('uuid/v1');

class Post extends Component {

	state = {
		comments: [],
		editting: false,
	}

	handlePostUpload = (e) => {
		e.preventDefault()
		const defaultValues = {
			id: uuidv1(),
			timestamp: Date.now(),
		}
		const inputValues = serializeForm(e.target, { hash: true })
		const post = {
			...defaultValues,
			...inputValues
		}
		//TODO dispatch post list update action
		ReadableAPI.uploadPost(post)
			.catch((reason) => {
				console.log(`>>> Post not uploaded due to: ${reason}`)
			})
	}

	handlePostEdit = (e) => {
		e.preventDefault()
		const inputValues = serializeForm(e.target, { hash: true })
		console.log(`>>> Original post author: ${this.props.post.author}`)
		let post = Object.assign({}, this.props.post, inputValues)
		console.log(`>>> Editted post author: ${post.author}`)
		//TODO dispatch post edit action
		this.toggleEditting()
		ReadableAPI.updatePost(post)
			.catch((reason) => {
				console.log(`>>> Post not updated due to: ${reason}`)
			})
	}

	deletePost = (id) => {
		//TODO dispatch post deletion action
		ReadableAPI.deletePost(id)
			.catch((reason) => {
				console.log(`>>> Post not deleted due to: ${reason}`)
			})
	}

	upVotePost = (id) => {
		//TODO dispatch action to update voteScore
		ReadableAPI.votePost(id, "upVote")
			.catch((reason) => {
					console.log(`>>> Vote not registered: ${reason}`)
				})
	}

	downVotePost = (id) => {
		//TODO dispatch action to update voteScore
		ReadableAPI.votePost(id, "downVote")
			.catch((reason) => {
					console.log(`>>> Vote not registered: ${reason}`)
				})
	}

	isEditting() {
		return this.state.editting
	}

	toggleEditting() {
		this.setState({ editting: !this.state.editting })
	}

	sendComment() {
		//TODO dispatch comment upload action
	}

	editComment() {
		//TODO dispatch comment update action
	}

	deleteComment() {
		//TODO dispatch comment delete action
	}

	getValidCategories() {
		const categories = this.props.categories
		const categoriesList = [ ...categories]
		return categoriesList.slice(1)
	}

	getComments() {
		ReadableAPI.getPostComments(this.props.post.id).then((comments) => {
			this.setState({ comments })
		})
	}

	getPostProps() {
		let props = {
			id: null,
			voteScore: null,
			title: null,
			author: null,
			body: null,
			category: null,
		}
		if (this.props.post)
			props = this.props.post
		return props
	}

	componentDidMount() {
		if (this.props.type === "display" || this.props.type === "details" )
			this.getComments()
	}

	render() {
		const { id, voteScore, title, author, body, category, commentCount } = this.getPostProps()
		const categories = this.getValidCategories()
		const type = this.props.type
		const { comments } = this.state
		return (
			<If condition={type !== "submit" && type !== "details"}>
				<Then>
					<section id={id} className="post">
						<If condition={this.isEditting() === false}>
							<Then>
								<section className="post-wrapper">
									<section className="vote-score-section">
										<FaAngleUp onClick={() => this.upVotePost(id)}/>
											<p>{voteScore}</p>
										<FaAngleDown onClick={() => this.downVotePost(id)}/>
									</section>
									<section className="post-section">
										<section className="post-title">
											<h3><Link to={`/${category}/${id}`}>{title}</Link> by {author} {commentCount} comments
											</h3>
											<div className="edit-button" onClick={() => this.toggleEditting()}>
												<FaEdit/>
											</div>
											<div className="delete-button" onClick={() => this.deletePost(id)}>
												<FaClose/>
											</div>
										</section>
										<section className="post-body">
											<p>{body}</p>

										</section>
										<If condition={comments instanceof Array}>
											<Then>
												<section className="comments-wrapper">
													{comments.map((comment) => (
															<Comment type="details" key={comment.id} comment={comment}/>
														))}
												</section>
											</Then>
											<Else>
												<p>Be the first to comment!</p>
											</Else>
										</If>
									</section>
								</section>
							</Then>
							<Else>
								<form onSubmit={this.handlePostEdit}>
									<section className="post-wrapper">
										<section className="vote-score-section">
											<FaAngleUp/>
												<p>{voteScore}</p>
											<FaAngleDown/>
										</section>
										<section className="post-section">
											<section className="post-header">
												<input className="post-title-input" type="text" name="title" defaultValue={title} placeholder="React is awesome!"/>
												<h3>by</h3>
												<input className="post-author-input" type="text" name="author" defaultValue={author} placeholder="ex.: Alan Brochier"/>
												<select name="category">
													{categories.map((category, index) => (
															<option
																key={index}
																value={category.name}>{category.name}</option>
														))}
												</select>
												<div className="cancel-button" onClick={() => this.toggleEditting()}>
													<FaBan/>
												</div>
											</section>
											<section className="post-body">
												<textarea className="post-body-input" name="body" defaultValue={body} placeholder="Write your commentary here...">
												</textarea>
												<input type="submit" value="Send"/>
											</section>
											<If condition={comments instanceof Array}>
												<Then>
													<section className="comments-wrapper">
														{comments.map((comment) => (
																<Comment type="details" key={comment.id} comment={comment}/>
															))}
													</section>
												</Then>
												<Else>
													<p>Be the first to comment!</p>
												</Else>
											</If>
										</section>
									</section>
								</form>
							</Else>
						</If>
					</section>
				</Then>
				<Else>
					<If condition={type === "details"}>
						<Then>
							<section id={id} className="post">
								<If condition={this.isEditting() === false}>
									<Then>
										<section className="post-wrapper">
											<section className="vote-score-section">
												<FaAngleUp onClick={() => this.upVotePost(id)}/>
													<p>{voteScore}</p>
												<FaAngleDown onClick={() => this.downVotePost(id)}/>
											</section>
											<section className="post-section">
												<section className="post-title">
													<h3>{title} by {author}  {commentCount} comments
													</h3>
													<div className="edit-button" onClick={() => this.toggleEditting()}>
														<FaEdit/>
													</div>
													<div className="delete-button" onClick={() => this.deletePost(id)}>
														<FaClose/>
													</div>
												</section>
												<section className="post-body">
													<p>{body}</p>

												</section>
												<If condition={comments instanceof Array}>
													<Then>
														<section className="comments-wrapper">
															{comments.map((comment) => (
																	<Comment type="details" key={comment.id} comment={comment}/>
																))}
															<Comment type="submit"/>
														</section>
													</Then>
													<Else>
														<p>Be the first to comment!</p>
													</Else>
												</If>
											</section>
										</section>
									</Then>
									<Else>
										<form onSubmit={this.handlePostEdit}>
											<section className="post-wrapper">
												<section className="vote-score-section">
													<FaAngleUp/>
														<p>{voteScore}</p>
													<FaAngleDown/>
												</section>
												<section className="post-section">
													<section className="post-header">
														<input className="post-title-input" type="text" name="title" defaultValue={title} placeholder="React is awesome!"/>
														<h3>by</h3>
														<input className="post-author-input" type="text" name="author" defaultValue={author} placeholder="ex.: Alan Brochier"/>
														<select name="category">
															{categories.map((category, index) => (
																	<option
																		key={index}
																		value={category.name}>{category.name}</option>
																))}
														</select>
														<div className="cancel-button" onClick={() => this.toggleEditting()}>
															<FaBan/>
														</div>
													</section>
													<section className="post-body">
														<textarea className="post-body-input" name="body" defaultValue={body} placeholder="Write your commentary here...">
														</textarea>
														<input type="submit" value="Send"/>
													</section>
													<If condition={comments instanceof Array}>
														<Then>
															<section className="comments-wrapper">
																{comments.map((comment) => (
																		<Comment key={comment.id} comment={comment}/>
																	))}
															</section>
														</Then>
														<Else>
															<p>Be the first to comment!</p>
														</Else>
													</If>
												</section>
											</section>
										</form>
									</Else>
								</If>
							</section>
						</Then>
						<Else>
							<form onSubmit={this.handlePostUpload}>
								<section className="post-wrapper">
									<section className="post-section">
										<section className="post-header">
											<input
												className="post-title-input"
												type="text"
												name="title"
												placeholder="React is awesome!"/>
											<h3>by</h3>
											<input
												className="post-author-input"
												type="text"
												name="author"
												placeholder="ex.: Alan Brochier"/>
											<select name="category">
												{categories.map((category, index) => (
														<option
															key={index}
															value={category.name}>{category.name}</option>
													))}
											</select>
										</section>
										<section className="post-body">
											<textarea
												className="post-body-input"
												name="body"
												placeholder="Write your commentary here...">
											</textarea>
											<input type="submit" value="Send"/>
										</section>
									</section>
								</section>
							</form>
						</Else>
					</If>
				</Else>
			</If>
		)
	}
}

Post.propTypes = {
	id: PropTypes.string,
	voteScore: PropTypes.number,
	title: PropTypes.string,
	author: PropTypes.string,
	body: PropTypes.string,
}

export default Post