import ButtonComponent from 'Components/Button/Button'
import Img from 'Components/Img/Img'
import React from 'react'
import { useCustomNavigate } from 'ResuableFunctions/CustomHooks'
import { Inputfunctions } from 'ResuableFunctions/Inputfunctions'
import Image from 'Utils/Image'
import JsonData from 'Utils/JsonData'

const SelectLanguagePage = () => {
    const { jsxJson } = JsonData();
    const navigate = useCustomNavigate();

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
                        <div className="card-body p-3 p-md-4 p-xl-5 pb-xl-3 select_language_height d-flex flex-wrap">
                            <div className="w-100">
                                <h5 className='mb-3 text_brand_color'>Select your Language</h5>
                                {Inputfunctions(jsxJson?.select_language_array)}
                            </div>

                            <div className="login_card_deisgn_absolute">
                                <Img src={Image.login_design}
                                    alt="people_ai_login_card-logo"
                                    width="70rem"
                                    height="70rem"
                                />
                            </div>

                            <div className="w-100 d-inline-flex align-items-end mb-4">
                                <ButtonComponent
                                    title="Continue"
                                    buttonName="Continue"
                                    className="btn btn_brand_color w-100"
                                    clickFunction={() => navigate("/select_font_details")}
                                />
                            </div>
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

export default SelectLanguagePage