import React, { useState, useEffect } from "react"
import './CreateSurvey.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import SideBar from "../dashboard/SideBar";
import backendLink from "../../server/backendLink";

const CreateSurvey = () => {
    const navigate = useNavigate()
    // ================================= Check if user is logged in =================================
    useEffect(() => {
        let loginStatus = localStorage.getItem("isLoggedIn")
        if (loginStatus === null) {
            // user not logged in, redirect to login page
            navigate('/login')
        }
    }, [])
    // ======================= Log out functionality =======================

    function logout() {
        navigate('/login')
        localStorage.removeItem("isLoggedIn")
    }

    // ======================= Taking user input =======================
    let userId = localStorage.getItem("userId")
    let [newSurvey, setNewSurvey] = useState({
        surveyName: "",
        description: "",
        type: "",
        startDate: "",
        endDate: "",
        otherCriteria: "",
        image: "",
        userId: userId
    })
    function ChangeSurveyName(e) {
        let value = e.target.value
        setNewSurvey({ ...newSurvey, surveyName: value })
    }
    function ChangeDescription(e) {
        let value = e.target.value
        setNewSurvey({ ...newSurvey, description: value })
    }
    function ChangeType(e) {
        let value = e.target.value
        setNewSurvey({ ...newSurvey, type: value })
    }
    function ChangeStartDate(e) {
        let value = e.target.value
        setNewSurvey({ ...newSurvey, startDate: value })
    }
    function ChangeEndDate(e) {
        let value = e.target.value
        setNewSurvey({ ...newSurvey, endDate: value })
    }
    function ChangeOtherCriteria(e) {
        let value = e.target.value
        setNewSurvey({ ...newSurvey, otherCriteria: value })
    }

    // ======================= Send survey to database =======================
    function addSurvey() {
        if (newSurvey.surveyName === '' || newSurvey.description === '' || newSurvey.type === ''
            || newSurvey.startDate === '' || newSurvey.endDate === '' || newSurvey.otherCriteria === ''
            || newSurvey.image === '') {
            alert('All fields are mandatory')
        } else {
            axios.post(`${backendLink}/newSurvey`, newSurvey)
                .then(() => {
                    navigate('/createQuestions')
                })
        }

    }

    // ======================= Change image to string =======================
    function convertImage(event) {
        let file = event.target.files[0]
        let reader = new FileReader()
        reader.onloadend = function () {
            setNewSurvey({ ...newSurvey, image: reader.result })
        }
        reader.readAsDataURL(file)
    }

    // ======================= Rendered Output =======================
    return (
        <div>
            {/* ================ Nav Bar at the top ================ */}
            <nav className='create-survey-navbar'>
                <div className='logo'>LOGO</div>
                <div className="log-out" onClick={logout}>Log Out</div>
            </nav>

            {/* ================ Side bar ================ */}
            <SideBar />

            {/* ================ Header ================ */}
            <header className="createhead">
                <h1>Create Survey</h1>
                <div className="header-buttons">
                    <Link to="/dashboard">
                        <button className="cancelbtn">Cancel</button>
                    </Link>
                    <button className="nextbtn" onClick={addSurvey}>Next</button>
                </div>
            </header>

            {/* ================ Main ================ */}
            <main className="create-survey-main">
                <div className="main1">
                    <div>
                        <h2>Name</h2>
                        <input id="namein" type="text" placeholder="" name="surveyName" onChange={(e) => ChangeSurveyName(e)} />
                    </div>
                    <div>
                        <h2>Description</h2>
                        <input id="descin" type="text" placeholder="" onChange={(e) => ChangeDescription(e)} />
                    </div>
                    <div>
                        <h2>Type of Survey</h2>
                        <select name="Select" id="surveyselect" onChange={(e) => ChangeType(e)}>
                            <option value="select">select</option>
                            <option value="Video">Video</option>
                            <option value="Image">Image</option>
                            <option value="Text">Text</option>
                        </select>
                    </div>
                </div>
                <div className="main2">
                    <div>
                        <h2>Start Date</h2>
                        <input className="datein" type="date" onChange={(e) => ChangeStartDate(e)} />
                    </div>
                    <div>
                        <h2>End Date</h2>
                        <input className="datein" type="date" onChange={(e) => ChangeEndDate(e)} />
                    </div>
                    <div>
                        <h2>Other Criteria</h2>
                        <input id="critin" type="text" placeholder="" onChange={(e) => ChangeOtherCriteria(e)} />
                    </div>
                    <div>
                        <h2>Upload Image</h2>
                        <label id="uploadlabel" htmlFor="upload" onChange={(e) => convertImage(e)}>
                            Drag and drop to Upload <br />
                            <input type="file" id="upload" />
                        </label>
                        {newSurvey.image !== '' ? <img src={newSurvey.image} className='upload-image' /> : <></>}
                    </div>
                </div>
            </main>
        </div>
    )
}
export default CreateSurvey