import ConversationCard from 'Components/Card/ConversationCard'
import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { handleGetAllTranscription } from '../Action/MainAction'
import { useDispatch } from 'react-redux'
import useCommonState from 'ResuableFunctions/CustomHooks'
import SpinnerComponent from 'Components/Spinner/Spinner'

const Conversations = () => {
    const { mainState } = useCommonState();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(handleGetAllTranscription())
    }, [])

    return (
        <div className="conversation_content_height col-12">
            <Card className='h-100 border-0 bg-transparent'>
                <Card.Header className='pt-2 bg-transparent border-0'>
                    <div className="row border-bottom py-4">
                        <div className="col">
                            <h6 className='mb-0'>Saved Conversations</h6>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className='overflowY mb-4 pt-0 h-100'>
                    <div className={`row ${mainState?.transaction_loading || !mainState.all_transcriptions?.length ? "h-100" : ""}`}>
                        {
                            mainState?.transaction_loading ?
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                    <div className="col text-center">
                                        <SpinnerComponent variant="success" />
                                        <p>Getting all transcription</p>
                                    </div>
                                </div>
                                :
                                mainState.all_transcriptions?.length ?
                                    mainState.all_transcriptions.map((value, index) => (
                                        <div key={index} className="col-12 col-md-6 col-lg-4 col-xxl-3 p-2">
                                            <ConversationCard ConversationData={value} dispatch={dispatch} mainState={mainState}/>
                                        </div>
                                    ))
                                    :
                                    <div className="h-100 d-flex justify-content-center align-items-center">
                                        <div className="col text-center">
                                            <p>No Data Found</p>
                                        </div>
                                    </div>
                        }
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Conversations