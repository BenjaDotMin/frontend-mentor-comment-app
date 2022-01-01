import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import replyImage from "../images/icons/icon-reply.svg";
import deleteImage from "../images/icons/icon-delete.svg";
import editImage from "../images/icons/icon-edit.svg";
import AddComment from "./AddComment";
import Modal from "./Modal";
import Score from "./Score";
import "../styles/Comment.scss";

function Comment({comments}) {   
    const [modal, setModal] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyingName, setReplyingToName] = useState(null);
    const [isReply, setIsReply] = useState(false);
    const [rerender, setRerender] = useState(false);
    let [currentComment, setCurrentComment] = useState(null);    
    let [currentReply, setCurrentReply] = useState(null);
    let [editingReply, setEditingReply] = useState(false);  

    const toggleModal = (comment, id) => {
        setModal(!modal);
        if(comments.comments[comment]?.user.username === comments.currentUser.username){
            setIsReply(false);
            setCurrentComment(currentComment = id);
        }else{
            setIsReply(true); 
            setCurrentComment(currentComment = comment);
            setCurrentReply(currentReply = id)
        }
    }
    const deleteReply = () => {      
        let getReply = comments.comments[currentComment];
        const filteredReplies = getReply.replies.filter(i => i.id !== currentReply);
        getReply.replies = filteredReplies; //update comments state
        localStorage.setItem("data", JSON.stringify(comments)); //update localStorage
    }

    const deleteComment = () => {      
        let getComments = comments.comments;        
        console.log(getComments)
        const filteredComments = getComments.filter(i => i.id !== currentComment);
        comments.comments = filteredComments; //update comments state       
        localStorage.setItem("data", JSON.stringify(comments)); //update localStorage
    }

    const replyToComment = (id, replyingToName, e) => {
        setReplyingTo(id);
        setReplyingToName(replyingToName);
        setTimeout(() => {
            const editableContent = e.target.closest(".comments__comment").querySelector(".add-comment i");
            let range = document.createRange();
            let sel = window.getSelection();        
            range.setStart(editableContent, 1);       
            sel.addRange(range);
            editableContent.focus();
        }, 10);
    }

    const sendMessage = (e, commentId) => {
        let currentComment = comments.comments[commentId];
        const newReplyObject = {id: uuidv4(), content: e, createdAt: `${new Date()}`, replies:[], replyingTo: replyingName, score:0, "user": {"image": {"png": comments.currentUser.image.png, "webp": comments.currentUser.image.webp}, "username": comments.currentUser.username}};
        const newReplies = [...currentComment.replies, newReplyObject]; //concat current replies and new reply
        currentComment.replies = newReplies; //update state 
        setReplyingTo(null); //remove AddComment box, and trigger re-render (not great)
        localStorage.setItem("data", JSON.stringify(comments)); //update localStorage
    }

    const sendNewMessage = e => {     
        const newReplyObject = {id: uuidv4(), content: e, createdAt: `${new Date()}`, replies:[], score:0, "user": {"image": {"png": comments.currentUser.image.png, "webp": comments.currentUser.image.webp}, "username": comments.currentUser.username}};
        const newReplies = [...comments.comments, newReplyObject]; //concat current replies and new reply
        comments.comments = newReplies; //update state 
        setRerender(!rerender); //trigger re-render (not great)
        localStorage.setItem("data", JSON.stringify(comments)); //update localStorage
    }

    const editReply = e => {
        setEditingReply(!editingReply);
        const editableContent = e.target.closest(".comment__details").querySelector("p");
        editableContent.classList.toggle("--is-editing");
        setTimeout(() => {
            let range = document.createRange();
            let sel = window.getSelection();        
            range.setStart(editableContent, 1);       
            sel.addRange(range);
            editableContent.focus();
        }, 10);       
    }

    const updateReply = (comment, reply, e) => {  
        let updatedReply = e.target.previousSibling.querySelector("i").innerText;   
        e.target.previousSibling.classList.remove("--is-editing");
        comments.comments[comment].replies.length === 0 ? (comments.comments[comment].content = updatedReply) : (comments.comments[comment].replies[reply].content = updatedReply); //check for replies
        localStorage.setItem("data", JSON.stringify(comments)); //update localStorage
        setEditingReply(!editingReply);
    }

    return (
        <div className="comments">
            {comments.comments.map((comment, i) => (            
                <div key={comment.id} className="comments__comment" style={{order: -comment.score}}>
                    <div className="comments__original-comment">
                        <Score comment={comment} comments={comments}/>
                        <div className="comment__details">
                            <div className="comment__titles">
                                <img src={comment.user.image.png} alt="user" />
                                <label>{comment.user.username}</label>
                                <span>{moment(comment.createdAt).fromNow() === "Invalid date" ? comment.createdAt : moment(comment.createdAt).fromNow()}</span>
                                <div className="comment__controls">                          
                                {comment.user.username === comments.currentUser.username ? (
                                    <>
                                        <button className="delete" onClick={() => toggleModal(i, comment.id)}>
                                            <img src={deleteImage} alt="delete" />
                                            <b>Delete</b>
                                        </button>
                                        <button className="edit" onClick={e => editReply(e)}>
                                            <img src={editImage} alt="edit" />
                                            <b>Edit</b>
                                        </button>
                                    </>
                                    ) :                                             
                                    <button onClick={e => replyToComment(comment.id, comment.user.username, e)} >
                                        <img src={replyImage} alt="reply" />
                                        <b>Reply</b>
                                    </button>                                               
                                    }                         
                                </div>                  
                            </div>               
                            <p contentEditable={editingReply && comment.user.username === comments.currentUser.username}><i>{comment.content}</i></p>
                            <button className="update-reply" onClick={e => updateReply(i, null, e)}>UPDATE</button> 
                        </div>  
                    </div>

                    {replyingTo === comment.id && <AddComment user={comments.currentUser} replyingName={replyingName} sendMessage={sendMessage} comment={i} />}

                    {comment.replies.map((reply, r) => (                      
                        <div key={reply.id} className="comments__comment --comment__reply">
                            <div className="comments__original-comment">
                                <Score comment={reply} comments={comments}/>
                                <div className="comment__details">
                                    <div className="comment__titles">
                                        <img src={reply.user.image.png} alt="user" />
                                        <label>{reply.user.username}</label>
                                        {reply.user.username === comments.currentUser.username && <b className="you">you</b>}
                                        <span>{moment(reply.createdAt).fromNow() === "Invalid date" ? reply.createdAt : moment(reply.createdAt).fromNow()}</span>
                                        <div className="comment__controls">
                                            {reply.user.username === comments.currentUser.username ? (
                                            <>
                                                <button className="delete" onClick={() => toggleModal(r, reply.id)}>
                                                    <img src={deleteImage} alt="delete" />
                                                    <b>Delete</b>
                                                </button>
                                                <button className="edit" onClick={e => editReply(e)}>
                                                    <img src={editImage} alt="edit" />
                                                    <b>Edit</b>
                                                </button>
                                            </>
                                            ) :                                             
                                            <button onClick={e => replyToComment(reply.id, reply.user.username, e)} >
                                                <img src={replyImage} alt="reply"/>
                                                <b>Reply</b>
                                            </button>                                                
                                            }       
                                        </div>                  
                                    </div>               
                                    <p contentEditable={editingReply && reply.user.username === comments.currentUser.username}><span>@{reply.replyingTo}</span> <i>{reply.content}</i></p>
                                    <button className="update-reply" onClick={e => updateReply(i, r, e)}>UPDATE</button>
                                </div>   
                            </div>      
                            {replyingTo === reply.id && <AddComment user={comments.currentUser} replyingName={replyingName} sendMessage={sendMessage} comment={i} reply={r}/>}
                        </div>
                    ))}                  
                </div>  
            ))}
            <AddComment user={comments.currentUser} sendNewMessage={sendNewMessage} comment={null}/>
            <Modal toggleModal={toggleModal} active={modal} deleteReply={deleteReply} deleteComment={deleteComment} isReply={isReply}/>
        </div>        
    )
}

export default Comment


