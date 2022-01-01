import "../styles/Modal.scss";

function Modal({toggleModal, active, deleteReply, deleteComment, isReply}){
    const closeModal = () => toggleModal(!active);

    const deleteSelectedReply = () => {
        isReply ? deleteReply() : deleteComment(); 
        closeModal();
    }

    return (
        <div className={`modal ${active ? 'active' : ''}`} onClick={() => closeModal()}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <label>Delete comment</label>
                <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>
                <div className="modal__cta">
                    <button className="cancel" onClick={() => closeModal()}>NO, CANCEL</button>
                    <button className="delete" onClick={() => deleteSelectedReply()}>YES, DELETE</button>
                </div>               
            </div>
        </div>      
    )
}

export default Modal


