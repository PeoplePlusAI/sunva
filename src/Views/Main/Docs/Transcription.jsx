import React, { useEffect, useRef } from 'react'
import ButtonComponent from 'Components/Button/Button'
import Img from 'Components/Img/Img'
import { Card } from 'react-bootstrap'
import useCommonState, { useDispatch } from 'ResuableFunctions/CustomHooks'
import Icons from 'Utils/Icons'
import Image from 'Utils/Image'
import JsonData, { languageCodeFinder } from 'Utils/JsonData'
import { Inputfunctions } from 'ResuableFunctions/Inputfunctions'
import useTTS, { playTtsAudio, stopTtsAudio } from '../Action/MainAction'
import DotLoader from 'Components/Spinner/DotLoader'

const Transcription = () => {
  const { commonState, mainState } = useCommonState();
  const { jsxJson } = JsonData();
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { sendText } = useTTS(commonState?.user_id, languageCodeFinder(commonState?.selected_language), mainState?.text_to_speech_gender?.toLowerCase(), () => console.log("Sending message..."))

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [mainState?.text_to_speech_data]);

  return (
    <div className="conversation_content_height p-3  d-flex justify-content-center">
      <div className="col-12 col-sm-11 col-md-10 col-lg-7">
        <Card className='h-100 border-0 rounded-4'>
          <Card.Header className='pt-2 bg-transparent border-0'>
            <div className="row border-bottom py-4">
              <div className="col">
                <h6 className='mb-0'>Transcription</h6>
              </div>
            </div>
          </Card.Header>

          <Card.Body ref={containerRef} className="highlights_backgorund scroll-container scroll_smooth">
            <div className="row align-content-start gap-4">
              {mainState?.text_to_speech_data?.map((value, index) => (
                value?.requested_for_audio ?
                  <div className="col-12 d-inline-flex" key={index}>
                    <div className="highlights_profile_div_width text-center">
                      <Img src={Image?.highlight_image} alt="highlights_image" />
                    </div>
                    <div className="highlights_profile_div_content">
                      <DotLoader />
                    </div>
                  </div>
                  :
                  <div className={`col-11 col-md-10 d-inline-flex ${value?.from === 'wss' ? 'me-auto' : 'ms-auto'}`} key={index}>
                    {/* Response from backend in LEFT SIDE  */}
                    <div className={`${value?.from === 'wss' ? 'highlights_profile_div_width text-center' : 'd-none'}`}>
                      <Img src={Image?.highlight_image} alt="highlights_image" />
                    </div>

                    <div className={`${value?.from === 'wss' ? 'highlights_profile_wss_div_content' : 'highlights_profile_user_div_content'} col mt-2 position-relative pt-4 overflow-hidden`}>
                      <p
                        className="fs-14 mb-0 mt-3"
                        dangerouslySetInnerHTML={{ __html: value?.from === 'wss' ? value?.enhanced : value?.original }}
                        style={{ fontSize: `${mainState?.font_page_details?.font_size}px`, fontWeight: mainState?.font_page_details?.font_weight * 100 }}
                      ></p>

                      <div className="row">
                        <div className="col text-end">
                          <ButtonComponent
                            buttonName={value?.from === 'wss' ? "Enhanced" : "Original"}
                            type="button"
                            className="btn highlights_button rounded-2 pe-none"
                          />
                        </div>
                      </div>

                      {/* audio play button  */}
                      <div className={`${value?.from === 'wss' ? 'paly_audio_tag' : 'd-none'}`}>
                        <ButtonComponent
                          type="button"
                          className="btn btn-brand-color"
                          buttonName={value?._id === mainState?.audio_data?._id ?
                            Icons?.pause_icon
                            :
                            Icons?.play_icon
                          }
                          clickFunction={value?._id === mainState?.audio_data?._id ?
                            () => dispatch(stopTtsAudio(dispatch))
                            :
                            () => dispatch(playTtsAudio({ _id: value?._id, audioBase64: value.audio }, dispatch))
                          }
                        />
                      </div>
                    </div>

                    {/* sending message from frontend in RIGHT SIDE  */}
                    <div className={`${value?.from === 'me' ? 'highlights_profile_div_width text-center' : 'd-none'}`}>
                      <Img src={Image?.highlight_image} alt="highlights_image" />
                    </div>
                  </div>
              ))}
            </div>
          </Card.Body>

          <Card.Footer className='py-3 bg-transparent border-0'>
            <div className="row justify-content-center">
              <div className="col-12 row align-items-center justify-content-center">
                <div className="col-10 col-md-11 pe-2 position-relative">
                  {Inputfunctions(jsxJson?.text_to_speech_input)}

                  <div className="transcription_genter_select_box">
                    {Inputfunctions(jsxJson?.select_gender_array)}
                  </div>
                </div>

                <ButtonComponent
                  type="button"
                  className="btn btn-brand-color send_message_button"
                  buttonName={Icons?.send_message_icon}
                  clickFunction={() => sendText()}
                  btnDisable={mainState?.disable_text_to_speech_typing}
                />
              </div>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div >
  )
}

export default Transcription