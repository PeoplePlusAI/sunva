import React, { Fragment, useEffect } from 'react';
import ButtonComponent from 'Components/Button/Button';
import HeaderCard from 'Components/Card/HeaderCard';
import Icons from 'Utils/Icons';
import Img from 'Components/Img/Img';
import Image from 'Utils/Image';
import { Inputfunctions } from 'ResuableFunctions/Inputfunctions';
import JsonData from 'Utils/JsonData';
import { handleGetAllLanguages, handleLogout } from 'Views/Common/Action/Common_action';
import { useCustomNavigate } from 'ResuableFunctions/CustomHooks';
import { UpdateModalBox } from 'Views/Common/Slice/Common_slice';

const Header = ({ offcanvasOn, offcanvasOnButton, dispatch }) => {
  const { jsxJson } = JsonData();
  const navigate = useCustomNavigate();

  useEffect(() => {
    dispatch(handleGetAllLanguages())
  }, [])

  const headerContentFunc = () => {
    return <Fragment>
      <div className="d-flex flex-wrap align-items-center">
        <div className="col-5">
          <Img src={Image?.CompanyLogo}
            alt="header_logo"
            width="160rem"
            height="30rem"
          />
        </div>

        <div className="col-7 d-none d-sm-flex flex-wrap justify-content-end align-items-center">
          <ButtonComponent
            type="button"
            className="btn btn-brand-color py-1"
            clickFunction={() => dispatch(UpdateModalBox({ size: 'xl', modal_from: 'home', modal_type: 'instructions', modal_close_btn: true }))}
            buttonName={Icons?.help_menu_icon}
          />

          <div className="col-lg-2">
            {Inputfunctions(jsxJson?.select_language_array)}
          </div>

          <div className="dropdown">
            <button className="btn btn-transparent ps-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <div className="header-icon-tag-width">
                <Img src={Image?.profile_image}
                  alt="profle_image"
                  width="40rem"
                  height="40rem"
                />
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" onClick={() => dispatch(handleLogout(navigate))}>Log out</a></li>
            </ul>
          </div>

          {
            offcanvasOn ?
              <div className={`d-inline-block header-icon-tag-width ${offcanvasOn !== '' ? `d-${offcanvasOn}-none` : 'd-none'}`}>
                <ButtonComponent
                  type="button"
                  clickFunction={offcanvasOnButton}
                  buttonName={Icons?.profileDefautUserIcon}
                />
              </div>
              :
              null
          }
        </div>

        <div className='col-7 d-flex d-sm-none justify-content-end'>
          <ButtonComponent
            type="button"
            className="btn btn-brand-color py-1"
            clickFunction={() => dispatch(UpdateModalBox({ size: 'xl', modal_from: 'home', modal_type: 'instructions', modal_close_btn: true }))}
            buttonName={Icons?.help_menu_icon}
          />

          <div className="dropdown ms-2">
            <button className="btn btn-brand-color w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {Icons?.menu_icon}
            </button>

            <ul className="dropdown-menu dropdown-menu-end py-2 mt-2">
              <li className='border-bottom'>
                <a className="dropdown-item text-center">
                  <Img src={Image?.profile_image}
                    alt="profle_image"
                    width="40rem"
                    height="40rem"
                  />
                  <p className='mb-0 mt-1'>
                    Welcome
                  </p>
                </a>
              </li>

              <li className='border-bottom py-1'>
                {Inputfunctions(jsxJson?.select_language_array)}
              </li>

              <li className='pt-1'>
                <a className="dropdown-item" onClick={() => dispatch(handleLogout(navigate))}>
                  Log out
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </Fragment>
  }

  return (
    <HeaderCard
      cardClassName='w-100 border-0 header-card py-2'
      cardTitleClassName="mb-0"
      cardContent={headerContentFunc()}
    />
  )
}

export default Header