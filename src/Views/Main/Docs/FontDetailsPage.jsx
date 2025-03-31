import ButtonComponent from 'Components/Button/Button'
import Img from 'Components/Img/Img'
import Textbox from 'Components/Input/textbox'
import React from 'react'
import useCommonState, { useCustomNavigate } from 'ResuableFunctions/CustomHooks'
import Image from 'Utils/Image'
import JsonData from 'Utils/JsonData'

const FontDetailsPage = () => {
    const { jsxJson } = JsonData();
    const navigate = useCustomNavigate();
    const {mainState} = useCommonState();

    return (
        <div className="people_ai_default_bg">
            <div className="row justify-content-center vh-100 align-items-center">
                <div className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-3 col-xxl-3 login-large-screen-width">
                    <div className="text-center mb-5">
                        <Img src={Image.CompanyLogo}
                            alt="people_ai-logo"
                            width="180rem"
                            height="40rem"
                        />
                    </div>

                    <div className="card border border-light-subtle rounded-4 shadow-sm login_card_deisgn">
                        <div className="card-body p-3 p-md-4 p-xl-5 pb-xl-3">
                            {
                                jsxJson?.select_font_details?.map((font_value, font_index) => {
                                    return font_value?.type === "textbox" ?
                                        <div className='col-12' key={font_index}>
                                            <Textbox
                                                value={font_value?.value}
                                                change={font_value?.change}
                                                cols={font_value?.cols}
                                                rows={font_value?.rows}
                                                placeholder={font_value?.placeholder}
                                                label={font_value?.name}
                                                labelClassName="text-secondary mb-0 fs-14"
                                                controlClassName={font_value?.controlClassName}
                                                mandatory={font_value?.isMandatory}
                                                inputError={font_value?.Err}
                                                disabled={font_value?.disabled}
                                                mainState={mainState?.font_page_details}
                                            />
                                        </div>
                                        :
                                        <div className="card my-2 font_drag_card border-0" key={font_index}>
                                            <div className="card-header border-0 bg-transparent">
                                                {font_value?.name}
                                            </div>
                                            <div className="card-body pt-0 row align-items-center">
                                                <div className="col text-center">
                                                    <h6 className='mb-0'>A</h6>
                                                </div>
                                                <div className="col-9">
                                                    <input
                                                        type={font_value?.type}
                                                        value={font_value?.value}
                                                        className={font_value?.className}
                                                        min={font_value?.min}
                                                        max={font_value?.max}
                                                        onChange={font_value?.change}
                                                    />
                                                </div>
                                                <div className="col text-center">
                                                    <h4 className='mb-0'>A</h4>
                                                </div>
                                            </div>
                                        </div>
                                })
                            }

                            <ButtonComponent
                                title="Continue"
                                buttonName="Continue"
                                className="btn btn_brand_color w-100 my-4"
                                clickFunction={()=>navigate("/dashboard/home")}
                            />
                        </div>

                        <div className="login_card_deisgn_absolute">
                            <Img src={Image.login_design}
                                alt="people_ai_login_card-logo"
                                width="70rem"
                                height="70rem"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="people_ai_default_bg_absolue">
                <Img src={Image.page_top_deign}
                    alt="people_ai-logo"
                    width="100rem"
                    height="80rem"
                />
            </div>
        </div>
    )
}

export default FontDetailsPage