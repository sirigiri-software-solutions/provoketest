
import "./index.css"
import speakNChatLogo from "../Images/Frame 63.png"
import speakNChatLogoText from "../Images/Frame 64.png";
import { MdPerson } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { ref, onValue } from "firebase/database";
import { database } from '../../Firebase';
import { useParams } from 'react-router-dom';
const UserPage =() =>{
    // const userId = localStorage.getItem('userInfo')
    const { userId } = useParams();
    // const [chatValue,setChatValue] = useState("");

    // useEffect(()=>{
    //     axios.get(`https://speak-n-chat-default-rtdb.firebaseio.com/register/${userId}.json`)
    //     .then((response) =>{
    //         const fetchedData = response.data;
    //         setChatValue(fetchedData.data);
    //     })

    // },[chatValue])

    const [dataFromDatabase, setDataFromDatabase] = useState('');
    const [dataFromDatabaseMic, setDataFromDatabaseMic] = useState('')
    const [userDataInfo,setuserDataInfo] = useState({});

    useEffect(() => {
      const dataRef = ref(database, `data${userId}`);
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Assuming the data structure includes a property named yourData
          setDataFromDatabase(data.chatInputData);
        }
      });
      const textRef = ref(database, `text${userId}`);
      onValue(textRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Assuming the data structure includes a property named yourData
          setDataFromDatabaseMic(data.transcript);
        }
      });
      const dataInfo = ref(database,`userDataInfo${userId}`);
      onValue(dataInfo,(snapshot)=>{
        const data = snapshot.val();
        if(data){
          setuserDataInfo(data.userFormData);
        }
      })
    }, []);
    
 
    return (
        <div className="mainBackgroundContainer">
            <div className="leftSectionContainer">
                <div className="logoContainer">
                <img className="logoProp" src={speakNChatLogo} alt="logo"/>
                {/* <img className='logoTextprop' src={speakNChatLogoText} alt="logoText" /> */}
                </div>
               <div className="userPageUserInfoMainCont">
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">Company Name :&nbsp;</p>
                <span> <strong> {userDataInfo.companyName}</strong></span>
                </div>
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">Payrole Name :&nbsp; </p>
                <span><strong>{userDataInfo.payroleName}</strong></span>
                </div>
                
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">To : &nbsp;</p>
                <span><strong>{userDataInfo.to}</strong></span>
                </div>
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">From : &nbsp;</p>
                <span><strong>{userDataInfo.from}</strong></span>
                </div>
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">Experience's : &nbsp;</p>
                <span><strong>{userDataInfo.experiences}</strong></span>
                </div>
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">Experience's revalent : &nbsp;</p>
                <span><strong>{userDataInfo.experiencesRelevant}</strong></span>
                </div>
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">Current CTC : &nbsp;</p>
                <span><strong>{userDataInfo.currentCTC}</strong></span>
                </div>
                <div className="eachuserInfocont">
                <p className="userPageUserInfo">Expected CTC : &nbsp;</p>
                <span><strong>{userDataInfo.expectedCTC}</strong></span>
                </div>

            

                </div>
               
            </div>
            <div className='rightSectionContainer' style={{marginTop:"-50px"}}>
               {/* <div className='rightSectionTopBar'>
               <MdPerson className='logIcon' />
                <h3 className="loginPName">siri</h3>
                <button className="signoutButton">sign out</button>
               </div> */}
               <div className="mobileViewContainer">
              <img className="mobilelogoProp" src={speakNChatLogo} alt="logo"/>
              </div>
              <hr className="mobileViewline" />
              <div className="mobileUserInfoContainer">
                 <div className="mobileeachuserInfocont">
                        <p className="mobileuserPageUserInfo">Company Name :&nbsp;</p>
                        <span> <strong> {userDataInfo.companyName}</strong></span>
                </div>
                <div className="mobileeachuserInfocont">
                <p className="mobileuserPageUserInfo">Payrole Name :&nbsp; </p>
                <span><strong>{userDataInfo.payroleName}</strong></span>
                </div>
                
                <div className="mobileeachuserInfocont">
                <p className="mobileuserPageUserInfo">To : &nbsp;</p>
                <span><strong>{userDataInfo.to}</strong></span>
                </div>
                <div className="mobileeachuserInfocont">
                <p className="mobileuserPageUserInfo">From : &nbsp;</p>
                <span><strong>{userDataInfo.from}</strong></span>
                </div>
                <div className="mobileeachuserInfocont">
                <p className="mobileuserPageUserInfo">Experience's : &nbsp;</p>
                <span><strong>{userDataInfo.experiences}</strong></span>
                </div>
                <div className="mobileeachuserInfocont">
                <p className="mobileuserPageUserInfo">Experience's revalent : &nbsp;</p>
                <span><strong>{userDataInfo.experiencesRelevant}</strong></span>
                </div>
                <div className="mobileeachuserInfocont">
                <p className="mobileuserPageUserInfo">Current CTC : &nbsp;</p>
                <span><strong>{userDataInfo.currentCTC}</strong></span>
                </div>
                <div className="mobileeachuserInfocont">
                <p className="mobileuserPageUserInfo">Expected CTC : &nbsp;</p>
                <span><strong>{userDataInfo.expectedCTC}</strong></span>
                </div>

                
               
              </div>
               

               <div className="rightSectionBottomContainer">
               <div style={{ marginTop:'0px'}}>
      <h2>Data from Mic:</h2>
    <div style={{border:"1px solid red", padding:'10px', minHeight:'150px', fontSize:"18px"}}> {dataFromDatabaseMic}</div>
      <h2>Data from Chat</h2>
    <div style={{border:"1px solid red", padding:'10px', minHeight:'400px', fontSize:"18px"}} dangerouslySetInnerHTML={{ __html: dataFromDatabase }}/>
    </div>
                  {/* <textarea placeholder="Mic" type="text" className='topInputContainer' />
                  
                  <textarea value={dataFromDatabase} placeholder="Chat" type="text" className='bottomInputContainer' /> */}
                  
               </div>
                
            </div>
            

        </div>
    )
}

export default UserPage;