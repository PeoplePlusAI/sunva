import React, { Fragment, useEffect, useRef } from 'react'
import ButtonComponent from 'Components/Button/Button'
import Img from 'Components/Img/Img'
import { Card } from 'react-bootstrap'
import Image from 'Utils/Image'
import useCommonState, { useDispatch } from 'ResuableFunctions/CustomHooks'
import DotLoader from 'Components/Spinner/DotLoader'
import { handleSaveTranscription } from '../Action/MainAction'
import Icons from 'Utils/Icons'
import { UpdateModalBox } from 'Views/Common/Slice/Common_slice'

const Home = () => {
    const { mainState } = useCommonState();
    const containerRef = useRef(null);
    const highlightsRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        if (highlightsRef.current) {
            highlightsRef.current.scrollTop = highlightsRef.current.scrollHeight;
        }
    }, [mainState?.audio_to_text_messages]);

    return (
        <div className='d-flex flex-wrap'>
            <div className="full_description_content_height col-6 pe-3 d-none d-lg-block">
                <Card className='h-100 border-0 rounded-4'>
                    <Card.Header className='pt-2 bg-transparent border-0'>
                        <div className="row border-bottom py-4">
                            <div className="col">
                                <h6 className='mb-0'>Summarization and Highlights CC</h6>
                            </div>
                        </div>
                    </Card.Header>

                    <Card.Body ref={highlightsRef} className='highlights_backgorund'>
                        <div className='row align-content-start gap-4'>
                            {mainState?.audio_to_text_messages?.map((value, index) => (
                                value?.requested_for_message ?
                                    null
                                    :
                                    <div className={`col-11 col-md-10 ${value?.type !== "transcription" ? 'd-inline-flex' : 'd-none'}`} key={index}>
                                        <div className={`${value?.from === 'wss' ? 'highlights_profile_div_width text-center' : 'd-none'}`}>
                                            <Img src={Image?.highlight_image} alt="highlights_image" />
                                        </div>

                                        <div className={`${value?.from === 'wss' ? 'highlights_profile_wss_div_content' : 'highlights_profile_user_div_content'} col mt-2 position-relative pt-4 overflow-hidden`}>
                                            <p
                                                className="fs-14 mb-0"
                                                dangerouslySetInnerHTML={{ __html: value?.text }}
                                                style={{ fontSize: `${mainState?.font_page_details?.font_size}px`, fontWeight: mainState?.font_page_details?.font_weight * 100 }}>

                                            </p>
                                            <div className="row">
                                                <div className="col text-end">
                                                    <ButtonComponent
                                                        buttonName={value?.type === "concise" ? "Concise" : "Highlights"}
                                                        type="button"
                                                        className="btn highlights_button rounded-2 pe-none"

                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${value?.from === 'me' ? 'highlights_profile_div_width text-center' : 'd-none'}`}>
                                            <Img src={Image?.highlight_image} alt="highlights_image" />
                                        </div>
                                    </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div className="full_description_content_height col-12 col-lg-6 ps-3 ps-lg-1">
                <Card className='h-100 border-0 rounded-4'>
                    <Card.Header className='py-2 bg-transparent border-0'>
                        <div className="row border-bottom py-3 pb-2">
                            <div className="col">
                                <h6 className='mb-1'>Full Transcription</h6>
                                <p className='mb-0 text-secondary'>Microphone
                                    <span className={`ps-2 ${mainState?.is_recording ? "text-success" : "text-danger"}`}>
                                        {mainState?.is_recording ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>

                            <div className="col text-end">
                                {
                                    mainState?.is_highlighted ?
                                        <ButtonComponent
                                            buttonName={Icons?.highlight_icon}
                                            type="button"
                                            className="rounded-2 px-3 border-0 d-md-none"
                                            clickFunction={() => dispatch(UpdateModalBox({ size: 'lg', modal_from: 'home', modal_type: 'highlights', modal_close_btn: true }))}
                                        />
                                        :
                                        null
                                }

                                <ButtonComponent
                                    buttonName={
                                        <Fragment>
                                            <span className='d-md-none'>
                                                {Icons?.save_icon}
                                            </span>
                                            <span className='d-none d-md-block'>
                                                Save Transcription
                                            </span>
                                        </Fragment>
                                    }
                                    type="button"
                                    className=" btn-brand-color rounded-2 px-3 ms-2"
                                    clickFunction={() => dispatch(handleSaveTranscription())}
                                    btnDisable={mainState?.audio_to_text_messages?.length < 1 || mainState?.is_recording}
                                />
                            </div>
                        </div>
                    </Card.Header>

                    <Card.Body ref={containerRef} className='highlights_backgorund'>
                        {mainState?.audio_to_text_messages?.length ?
                            <div className='row align-content-start gap-4 h-100'>
                                {mainState?.audio_to_text_messages?.map((value, index) => (
                                    value?.requested_for_message ?
                                        <div className="col-12 d-inline-flex" key={index}>
                                            <div className="highlights_profile_div_width text-center">
                                                <Img src={Image?.highlight_image} alt="highlights_image" />
                                            </div>
                                            <div className="highlights_profile_div_content">
                                                <DotLoader />
                                            </div>
                                        </div>
                                        :
                                        <div className={`col-11 col-md-10 ${value?.type === "transcription" ? 'd-inline-flex' : 'd-none'} ms-auto`} key={index}>
                                            <div className='highlights_profile_user_div_content col mt-2 position-relative pt-4 overflow-hidden'>
                                                <p
                                                    className="fs-14 mb-0"
                                                    dangerouslySetInnerHTML={{ __html: value?.text }}
                                                    style={{ fontSize: `${mainState?.font_page_details?.font_size}px`, fontWeight: mainState?.font_page_details?.font_weight * 100 }}>
                                                </p>
                                                <div className="row">
                                                    <div className="col text-end">
                                                        <ButtonComponent
                                                            buttonName={"Original"}
                                                            type="button"
                                                            className="btn highlights_button rounded-2 pe-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`highlights_profile_div_width text-center`}>
                                                <Img src={Image?.highlight_image} alt="highlights_image" />
                                            </div>
                                        </div>
                                ))}
                            </div>
                            :
                            <div class="h-100 row align-items-center pe-none">
                                <p className='text-center'>
                                    Kindly click the microphone button below to start recording
                                </p>
                            </div>
                        }
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

export default Home