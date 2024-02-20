import React from 'react'

const Modal = (props) => {
    const {onClose, title, children, data} = props;
    
    return (
        <div id="myModal" class="modal">
            <div class="modal-content">
                <div className='w-full flex justify-between items-center'>
                    <div>{title}</div>
                    <span onClick={onClose} class="close">&times;</span>
                </div>
                <div>{children}</div>
            </div>

        </div>
    )
}

export default Modal