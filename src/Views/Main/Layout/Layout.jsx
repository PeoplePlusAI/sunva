import ButtonComponent from 'Components/Button/Button'
import Img from 'Components/Img/Img'
import Header from 'Components/Panel_compnent/Header'
import React, { Fragment, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks'
import Image from 'Utils/Image'
import JsonData from 'Utils/JsonData'
import { updateToast } from 'Views/Common/Slice/Common_slice'

const Layout = () => {
    const { commonState } = useCommonState();
    const { jsonOnly } = JsonData();
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();

    useEffect(() => {
        if (!commonState?.token || !commonState?.user_id || !commonState?.email) {
            // dispatch(updateToast({ message: "Login first to access sunva platform", type: "error" }))
            navigate("/")
            return
        }
    }, [commonState?.token, commonState?.user_id, commonState?.email])

    return (
        <main>
            <div className="container-fluid main_layout">
                <Header dispatch={dispatch} />

                <div className="h-100 mt-3">
                    <section className='full_description_bg'>
                        <Outlet />
                    </section>

                    <div className="col mt-3 d-flex justify-content-center">
                        <div className="col-12 col-md-9 col-lg-7">
                            <div className="navigation_menubar">
                                {
                                    jsonOnly?.navigation_menubar?.map((button, button_index) => (
                                        <Fragment key={button_index}>
                                            <ButtonComponent
                                                type="button"
                                                className={`btn ${button?.active ? "border-white" : ""}`}
                                                title={button?.title}
                                                buttonName={button?.icon}
                                                clickFunction={button?.click}
                                                touchStart={button?.touchStart}
                                                mouseDown={button?.mouseDown}
                                            />
                                        </Fragment>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* left top design */}
            <div className="home_card_deisgn_one_absolute">
                <Img src={Image?.main_home_one_design}
                    alt="people_ai_login_card-logo"
                    width="100rem"
                    height="100rem"
                />
            </div>

            {/* bottom right design */}
            <div className="home_card_deisgn_two_absolute">
                <Img src={Image?.main_home_two_design}
                    alt="people_ai_login_card-logo"
                    width="90rem"
                    height="180rem"
                />
            </div>
        </main>
    )
}

export default Layout