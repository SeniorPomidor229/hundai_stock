import React from 'react'

import { AiOutlineClose } from 'react-icons/ai';

export const CustomModal = ({ show = false, setShow = (togle) => { }, onClick = () => {}, title = "", children }) => {
    return (
        <>
            {
                show ? <div onClick={() => setShow(false)} className='modal_wrapp'>
                    <div onClick={(e) => e.stopPropagation()} className="modal_content">
                        <AiOutlineClose onClick={() => setShow(false)} className='modal_content_cross' size={20} />
                        <div className="modal_body">
                            {children}
                        </div>

                        <button onClick={() => onClick()} className="button modal_btn">{title}</button>
                    </div>
                </div> : null
            }
        </>
    )
}
