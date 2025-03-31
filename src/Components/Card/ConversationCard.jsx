import Img from 'Components/Img/Img'
import React from 'react'
import { Card } from 'react-bootstrap'
import Icons from 'Utils/Icons'
import Image from 'Utils/Image'
import { handleGetIndividualTranscription } from 'Views/Main/Action/MainAction'

const ConversationCard = ({ ConversationData, dispatch, mainState }) => {

    return (
        <Card className='w-100 position-relative conversation_card_border rounded-4 h-100 cursor-pointer' onClick={() => dispatch(handleGetIndividualTranscription(ConversationData?.id))}>
            <Card.Body className='p-4 overflow-hidden'>
                <h6
                    style={{ fontSize: `${mainState?.font_page_details?.font_size}px`, fontWeight: mainState?.font_page_details?.font_weight * 100 }}>
                    {ConversationData?.transcription?.slice(0, 10) + ".."}
                </h6>
                <p
                    className='conversation_content'
                    style={{ fontSize: `${mainState?.font_page_details?.font_size}px`, fontWeight: mainState?.font_page_details?.font_weight * 100 }}>
                    {ConversationData?.transcription?.slice(0, 120) + (ConversationData?.transcription?.length > 120 ? "...." : "")}
                </p>

                <div className="w-100 d-flex flex-wrap align-items-center justify-content-end">
                    {/* <div className="col conversation_stratergy">
                        <p className='mb-0 p-2'>Ecommerce digital strategy</p>
                    </div> */}

                    <div className="col-6 d-inline-flex justify-content-center justify-content-sm-end justify-content-lg-center justify-content-xxl-end">
                        <div className="col-6 position-relative text-center">
                            <Img src={Image?.highlight_image} alt="highlights_image" width="39rem" />
                            <div className="conversation_stratergy_image">
                                <Img src={Image?.highlight_image} alt="highlights_image" width="39rem" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>

            <Card.Footer className='row align-items-center py-3 bg-transparent '>
                {/* <div className="col">
                    <p className='mb-0 fs-13 text-secondary'>2 day ago</p>
                </div> */}
                <div className="col ">
                    <p className='mb-0 text-end conversation_stratergy_like'>
                        <span className='pe-1'>{Icons?.like_icon}</span>
                        Liked
                    </p>
                </div>
            </Card.Footer>
        </Card>
    )
}

export default ConversationCard