// import { useDispatch } from "ResuableFunctions/CustomHooks";
import ModalComponent from "Components/Modal/Modal";
import useCommonState, { useDispatch } from "./CustomHooks";
import ButtonComponent from "Components/Button/Button";
import Img from "Components/Img/Img";
import Image from "Utils/Image";
import { Card } from "react-bootstrap";
import SpinnerComponent from "Components/Spinner/Spinner";
import { useEffect, useRef } from "react";
import { resetModalBox } from "Views/Common/Slice/Common_slice";

export function OverallModel() {
    const { commonState, mainState } = useCommonState();
    const highlightsRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (highlightsRef.current) {
            highlightsRef.current.scrollTop = highlightsRef.current.scrollHeight;
        }
    }, [mainState?.audio_to_text_messages]);


    function modalHeaderFun() {
        switch (commonState?.modal_from) {
            case "transcription":
                switch (commonState?.modal_type) {
                    case "individual":
                        return <h6 className='mb-0'>My Conversation</h6>;

                    default:
                        break;
                }
                break;

            case "home":
                switch (commonState?.modal_type) {
                    case "highlights":
                        return <h6 className='mb-0'>Highlights</h6>

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    function modalBodyFun() {
        switch (commonState?.modal_from) {
            case "transcription":
                switch (commonState?.modal_type) {
                    case "individual":
                        return <div className="transcription_content_height col-12">
                            {
                                mainState?.individual_transaction_loading ?
                                    <div className="h-100 d-flex justify-content-center align-items-center">
                                        <div className="col text-center">
                                            <SpinnerComponent variant="success" />
                                            <p>Getting transcription</p>
                                        </div>
                                    </div>
                                    :
                                    mainState?.selected_transcriptions?.length ?
                                        <Card className='h-100 border-0 rounded-4'>
                                            <Card.Body className='highlights_backgorund'>
                                                <div className='row align-content-start gap-4'>
                                                    {mainState?.selected_transcriptions?.map((value, index) => (
                                                        <div className={`col-12 d-inline-flex ms-auto`} key={index}>
                                                            <div className='highlights_profile_user_div_content col mt-2 position-relative pt-4 overflow-hidden'>
                                                                <p
                                                                    className="fs-14 mb-0"
                                                                    style={{ fontSize: `${mainState?.font_page_details?.font_size}px`, fontWeight: mainState?.font_page_details?.font_weight * 100 }}>
                                                                    {value}
                                                                </p>

                                                                <div className="row">
                                                                    <div className="col text-end">
                                                                        <ButtonComponent
                                                                            buttonName={value?.from === 'wss' ? "Enhanced" : "Original"}
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
                                            </Card.Body>
                                        </Card>
                                        :
                                        <div className="h-100 d-flex justify-content-center align-items-center">
                                            <div className="col text-center">
                                                <p>No Data Found</p>
                                            </div>
                                        </div>
                            }
                        </div>

                    default:
                        break;
                }
                break;

            case "home":
                switch (commonState?.modal_type) {
                    case "highlights":
                        return <Card className='h-100 border-0 rounded-4'>
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

                    case "instructions":
                        return <div className="col p-2 p-md-5 py-md-2">
                            <h2 className='my-3 mb-4 text-center ' style={{ color: '#005C75' }}>Welcome to Sunva AI - Empowering Conversations! </h2>
                            <p className='px-3 mb-4' style={{ fontWeight: '450', fontSize: '16px' }}>
                                Sunva AI is an intelligent platform designed to transform spoken dialogues into accessible, enhanced textual conversations. The application captures live speech, provides real-time transcriptions, generates concise highlights, and enhances interactions using AI-powered suggestions. Sunva AI supports multiple languages and customization of text readability for maximum accessibility.
                            </p>

                            <div className="col">
                                <h2 className='my-3 mb-4 ' style={{ color: '#005C75' }}>Getting Started</h2>
                                <h5 className=''>Activate Microphone:</h5>
                                <ul className="ps-4">
                                    <li className="mb-0">Click the microphone button to start capturing speech.</li>
                                    <li>Ensure your browser has microphone permissions enabled.</li>
                                </ul>
                            </div>

                            <div className="col">
                                <h5 className=''>View Transcriptions:</h5>
                                <ul className="ps-4">
                                    <li className="mb-0">Live speech will appear instantly in the transcription panel.</li>
                                    <li>Enhanced AI responses appear highlighted for better clarity.</li>
                                </ul>
                            </div>

                            <div className="col">
                                <h5 className=''>Highlights Panel:</h5>
                                <ul className="ps-4">
                                    <li className="mb-0">Important or concise parts of conversations are automatically extracted.</li>
                                    <li>Click "Concise" to refine or simplify highlights further.</li>
                                </ul>
                            </div>

                            <div className="col">
                                <h5 className=''>Language Selection:</h5>
                                <ul className="ps-4">
                                    <li className="mb-0">Select your preferred language (English, Hindi, Kannada, Malayalam, Tamil) from the dropdown.</li>
                                </ul>
                            </div>

                            <div className="col">
                                <h5 className=''>Voice Customization:</h5>
                                <ul className="ps-4">
                                    <li className="mb-0">Choose between male and female voice outputs for enhanced interactions.</li>
                                </ul>
                            </div>

                            <div className="col">
                                <h5 className=''>Save and Review Conversations:</h5>
                                <ul className="ps-4">
                                    <li className="mb-0">Conversations can be saved and reviewed later.</li>
                                    <li>Liked conversations are marked clearly for easy access.</li>
                                </ul>
                            </div>

                            <div className="col">
                                <h5 className=''>Customize Text:</h5>
                                <ul className="ps-4">
                                    <li className="mb-0">Adjust font size and weight in settings for improved readability.</li>
                                    <li>Enjoy seamless and empowered communication with Sunva AI.</li>
                                </ul>
                            </div>
                        </div>

                    default:
                        break;

                }
            default:
                break;
        }
    }

    function modalFooterFun() {
        switch (commonState?.modal_from) {
            case "home":
                switch (commonState?.modal_type) {
                    case "instructions":
                        return <div className="w-100 px-3">
                            <ButtonComponent
                                buttonName="Close"
                                type="button"
                                className="btn-brand-color w-100 rounded-2"
                                clickFunction={() => dispatch(resetModalBox())}
                            />
                        </div>

                    default:
                        break;
                }

            default:
                break;
        }
    }

    return (
        <ModalComponent
            show={commonState?.modalShow}
            modalSize={commonState?.moalSize}
            modalCentered={true}
            modalCloseButton={commonState?.modal_close_btn}
            // modalOnHideFun={modalHeaderCloseFun}
            showModalHeader={true}
            modalHeaderClassname="border-0"
            modalHeader={modalHeaderFun()}
            modalBodyClassname="py-2"
            modalBody={<div className='d-flex flex-wrap p-3 py-0'>{modalBodyFun()}</div>}
            showModalFooter={true}
            modalFooterClassname="border-0"
            modalFooter={modalFooterFun()}
            modalClassname={["lg", "xl"].includes(commonState?.moalSize) ? "model_height_lg" : ''}
        />
    )
}