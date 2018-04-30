import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { If, Then, Else } from 'react-if'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../comment.css'
import serializeForm from 'form-serialize'
import { uploadComment, updateComment, removeComment, voteOnComment } from '../actions'
import { connect } from 'react-redux'
const uuidv1 = require('uuid/v1')

class Comment extends Component {

	state = {
		editting: false,
	}

	toggleEditting() {
		this.setState({ editting: !this.state.editting })
	}

	isEditting() {
		return this.state.editting
	}

	handleCommentUpload = (e) => {
		e.preventDefault()
		const defaultValues = {
			id: uuidv1(),
			timestamp: Date.now(),
			parentId: this.props.parentId,
			parentDeleted: false,
			deleted: false,
			voteScore: 1,
		}
		const inputValues = serializeForm(e.target, { hash: true })
		const comment = {
			...defaultValues,
			...inputValues,
		}
		this.props.uploadComment(comment)
		this.resetInputForm()
	}

	resetInputForm = () => {
		const commentUploadForm = document.getElementById("commentUploadForm")
		commentUploadForm.reset()
	}

	handleCommentUpdate = (e) => {
		e.preventDefault()
		const inputValues = serializeForm(e.target, { hash: true })
		let comment = Object.assign({}, this.props.comment, inputValues)
		this.props.updateComment(comment)
		this.toggleEditting()
	}

	deleteComment = (comment) => {
		this.props.deleteComment(comment)
	}

	upVoteComment = (id) => {
		this.props.voteComment({ id, option: "upVote" })
	}

	downVoteComment = (id) => {
		this.props.voteComment({ id, option: "downVote" })
	}

	getCommentProps() {
		let props = {
			id: null,
			voteScore: null,
			author: null,
			body: null,
		}
		if (this.props.comment)
			props = this.props.comment
		return props
	}

	render() {
		const { id, voteScore, author, body } = this.getCommentProps()
		const type = this.props.type
		return (
			<If condition={type === "details"}>
				<Then>
					<section id={id} className="comment">
						<If condition={this.isEditting() === false}>
							<Then>
								<section className="comment-wrapper">
									<section className="comment-vote-score-section">
										<FaAngleUp className="comment-action-button" onClick={() => this.upVoteComment(id)}/>
											<p className="comment-vote-score">{voteScore}</p>
										<FaAngleDown className="comment-action-button" onClick={() => this.downVoteComment(id)}/>
									</section>

									<section className="comment-section">
										<section className="comment-header">
											<section className="comment-header-texts">
												<h4>by </h4><h3>{author}</h3>
											</section>

											<section className="comment-header-buttons">
												<div className="edit-button comment-action-button" onClick={() => this.toggleEditting()}>
													<FaEdit/>
												</div>

												<div className="delete-button comment-action-button" onClick={() => this.deleteComment(this.props.comment)}>
													<FaClose/>
												</div>
											</section>
										</section>

										<section className="comment-body">
											<p className="comment-body-text">{body}</p>
										</section>
									</section>
								</section>
							</Then>
							<Else>
								<form onSubmit={this.handleCommentUpdate} className="comment-upload-form">
									<section className="comment-wrapper">
										<section className="comment-upload-section">
											<section className="comment-upload-header">
												<section className="comment-header-texts">
													<input required
														className="comment-author-input"
														type="text"
														name="author"
														defaultValue={author}/>
												</section>

												<section className="comment-header-buttons">
													<div className="cancel-button comment-action-button" onClick={() => this.toggleEditting()}>
														<FaBan/>
													</div>
												</section>
											</section>

											<section className="comment-body">
												<textarea required
													className="comment-body-input"
													name="body"
													defaultValue={body}>
												</textarea>

												<button className="comment-upload-button" type="submit">Send</button>
											</section>
										</section>
									</section>
								</form>
							</Else>
						</If>
					</section>
				</Then>
				<Else>
					<form id="commentUploadForm" className="comment-upload-form" onSubmit={this.handleCommentUpload}>
						<section className="comment-wrapper">
								<section className="comment-upload-section">
									<section className="comment-upload-header">
										<input required
											className="comment-author-input"
											type="text"
											name="author"
											placeholder="My name is..."/>
									</section>

									<section className="comment-body">
										<textarea required
											className="comment-body-input"
											type="text"
											name="body"
											placeholder="Write your comment here...">
										</textarea>

										<button className="comment-upload-button" type="submit">Send</button>
									</section>
								</section>
						</section>
					</form>
				</Else>
			</If>
		)
	}
}

Comment.propTypes = {
	id: PropTypes.string,
	voteScore: PropTypes.number,
	author: PropTypes.string,
	body: PropTypes.string,
}

function mapDispatchToProps(dispatch) {
	return {
		uploadComment: (data) => dispatch(uploadComment(data)),
		updateComment: (data) => dispatch(updateComment(data)),
		deleteComment: (data) => dispatch(removeComment(data)),
		voteComment: (data) => dispatch(voteOnComment(data)),
	}
}

export default connect(null, mapDispatchToProps)(Comment)