import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { read } from '../actions/post';
import { create } from '../actions/apost';
import '../style/new_lost.css';
import CreateMap from '../components/CreateMap';
import M_buildings from "../buildings/M_buildings"
import Y_buildings from "../buildings/Y_buildings"
import cssImage from '../img/skkulogo.png';

const New_lost = ({ read, create, isAuthenticated, _user }) => {
    
    useEffect(() => {
        if (isAuthenticated) {
            document.body.className='NL-body';
        }
    });

    // map 관련
    const [map, setMap] = useState(false);
    const [mapButton, setMapButton] = useState(false);
    const [isAddress, setIsAddress] = useState(false);
    // 게시물 생성되면 목록 화면으로 나가도록 작동
    const [postCreated, setPostCreated] = useState(false);
    // page 값 바뀌면 page 넘어감
    const [page, setPage] = useState(true);
    // 게시물 관련 값 변경
    const [imageData, setImageData] = useState({ image: null });
    const [postData, setPostData] = useState({
        lost_found: 'L',
        title: '',
        campus: '',
        building: '',
        latitude: '',
        longitude: '',
        address: '',
        location: '',
        date: '',
        item: '',
        color: '',
        content: ''
    });

    const { lost_found, title, campus, building, latitude, longitude, address, location, date, item, color, content } = postData;
    const { image } = imageData;

    // 캠퍼스 선택시 해당 건물 담음
    const [buildingList, setBuildingList] = useState([<option value="">선택</option>]);

    // 명륜, 율전 건물 이름 변수에 담기
    const seoul = M_buildings.datas.map((building) => building.name);
    const suwon = Y_buildings.datas.map((building) => building.name);


    const onChangeImage = (e) => {
        setImageData({ ...imageData, [e.target.name]: e.target.files[0] });
    };

    // 건물 선택시 지도 위치 자동으로 골라지도록!!
    const onChangeBuilding = (e) => {
        // 일단 건물 바뀌면 세부 주소 무조건 보여주면 안됨
        setIsAddress(false);
        if (e.target.value !== '' && e.target.value !== '교외 (학교 주변)') {
            // 교외 (학교 주변)일 때만 해당하므로 지도 버튼 안 보여줌
            setMapButton(false);
            // 명륜 캠퍼스 내 학관 골랐을 시 지도 자동 생성
            if (campus === 'M') {
                M_buildings.datas.map((data) => {
                    if (e.target.value === data.name) {
                        setPostData({
                            ...postData,
                            [e.target.name]: e.target.value,
                            ['latitude']: data.latitude,
                            ['longitude']: data.longitude,
                            ['address']: data.address
                        });
                    }
                });
            // 율전 캠퍼스 내 학관 골랐을 시 지도 자동 생성
            } else if (campus === 'Y') {
                Y_buildings.datas.map((data) => {
                    if (e.target.value === data.name) {
                        setPostData({
                            ...postData,
                            [e.target.name]: e.target.value,
                            ['latitude']: data.latitude,
                            ['longitude']: data.longitude,
                            ['address']: data.address
                        });
                    }
                });
            }
        } 
        // 그 외의 경우는 건물만 등록되고 위치 좌표와 주소는 등록되지 않음
        else {
            // 교외의 경우 직접 지도로 등록
            if (e.target.value === '교외 (학교 주변)') {
                setMapButton(true);
            }
            // 건물 선택 안 했을 시 지도 입력 들어가도록
            else if (e.target.value === '') {
                setMapButton(false);
            }
            setPostData({
                ...postData,
                [e.target.name]: e.target.value,
                ['latitude']: '',
                ['longitude']: '',
                ['address']: ''
            });
        }
    };

    const onChange = (e) => {
        if (e.target.name === "campus") {
            let elemArray=[];
            if (e.target.value === "M") {
                for (let i = 0; i < seoul.length; i++) {
                    elemArray.push(<option value={seoul[i]}>{seoul[i]}</option>);
                }
                // 캠퍼스가 바뀌었으므로 건물 값, 지도 위치 모두 초기화
                setMapButton(false);
                setPostData({
                    ...postData,
                    [e.target.name]: e.target.value,
                    ['building']: '',
                    ['latitude']: '',
                    ['longitude']: '',
                    ['address']: ''
                });
                
            } else if (e.target.value === "Y") {
                for (let i = 0; i < suwon.length; i++) {
                    elemArray.push(<option value={suwon[i]}>{suwon[i]}</option>);
                }
                // 캠퍼스가 바뀌었으므로 건물 값, 지도 위치 모두 초기화
                setMapButton(false);
                setPostData({
                    ...postData,
                    [e.target.name]: e.target.value,
                    ['building']: '',
                    ['latitude']: '',
                    ['longitude']: '',
                    ['address']: ''
                });

            } else {
                // 캠퍼스 다시 선택으로 바뀌었을 시 건물 선택창도 선택만 뜨도록
                elemArray.push(<option value=''>선택</option>);
                // 캠퍼스가 바뀌었으므로 건물 값, 지도 위치 모두 초기화
                setMapButton(false);
                setPostData({
                    ...postData,
                    [e.target.name]: e.target.value,
                    ['building']: '',
                    ['latitude']: '',
                    ['longitude']: '',
                    ['address']: ''
                });
            }
            setBuildingList(elemArray);
            // 그 외의 경우는 모두 값 반영
        } else {
            setPostData({...postData, [e.target.name]: e.target.value});
        }
    };


    const onSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', _user.id);
        formData.append('lost_found', lost_found);
        formData.append('title', title);
        formData.append('campus', campus);
        formData.append('building', building);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('address', address);
        formData.append('location', location);
        formData.append('date', date);
        formData.append('item', item);
        formData.append('color', color);
        // 이미지 null값일 경우 보내지 않음
        if (image!==null){
            formData.append('image', image);
        }
        formData.append('content', content);

        create(formData);
        setTimeout(read,1000);
        setPostCreated(true);
    };

    // 지도 위치 관련 정보 함수
    const getAddress = (latitude, longitude, address) => {

        // 지도에서 주소를 가져왔을 시에만 세부 주소 보여줌
        if (address !== '') {
            setIsAddress(true);
        } else {
            setIsAddress(false);
        }

        setPostData({
            ...postData,
            ['latitude']: latitude,
            ['longitude']: longitude,
            ['address']: address
        });
    };

    // 로그인 안 했을 시 로그인 페이지로
    if (!isAuthenticated) {
        return <Redirect to = '/login' />
    }

    // 게시물 등록했을 시 목록 페이지로
    if (postCreated) {
        return <Redirect to = '/search_lost' />
    }

    // 팝업창 켜기
    const openModal = (e) => {
        e.preventDefault();
        setMap(true);
    }

    // 팝업창 끄기
    const closeModal = () => {
        setMap(false);
    }

    // 지도 나타남
    const mapView = () => (
        <div className="modal">
            <div className="modal__overlay" onClick={closeModal}></div>
            <div className="modal__content">
                <CreateMap mapCreator={getAddress} mapOff={closeModal} campus={campus} />
            </div>
        </div>
    );

    // 팝업창 사라짐
    const noView = () => (
        <div></div>
    );

    // 세부 주소 초기화
    const closeIsAddress = () => {

        setIsAddress(false);
        // 지도 좌표 관련 데이터 초기화
        setPostData({
            ...postData,
            ['latitude']: '',
            ['longitude']: '',
            ['address']: ''
        });
    }

    // 지도 입력 했을 시 세부 주소 관련 태그
    const showAddress = () => (
        <div className="NL-campus_detail">
            <div className="NL-new_theme_detail">{address}</div>
            <div className="NL-new_sel_detail">
                <button className="NL-campus_opt_detail" onClick={closeIsAddress}> 
                        x
                </button>
            </div>
        </div>

    );

    // 지도입력 버튼 나타남
    const mapButtonPop = () => (
        <div>
            <div className="NL-campus">
                <div className="NL-new_theme">분실 위치</div>
                <div className="NL-new_sel">
                    <button className="NL-campus_opt" onClick={openModal}> 
                        지도입력
                    </button>
                    {map ? mapView() : noView()}
                </div>
            </div>
            {isAddress ? showAddress() : noView()}
        </div>
    );

    // 지도입력 버튼 사라짐
    const noButtonPop = () => (
        <div></div>
    );

    // 다음 페이지로 넘어감 (pg1 -> pg2)
    const nextPage = (e) => {
        e.preventDefault();
        setPage(false);
    };

    const page1 = () => (
        <div>
            <div className="NL-new_exp" id='pg1'>
                <h2>카테고리 선택</h2>
                <p>카테고리에 맞게 분실물을 등록하고, <br /> 비슷한 습득물이 올라오면 알림으로 받아보세요!</p>
            </div>
            <div className="NL-container">
                <h2>캠퍼스 선택</h2>
                <div className="NL-select-box">
                    <div className="options-container">
                        <div className="option">
                            <input type="radio" className="select" id="M" name="category"/>
                            <label for="M">명륜 캠퍼스</label>
                        </div>
                        <div className="option">
                            <input type="radio" class="select" id="Y" name="category" />
                            <label for="Y">율전 캠퍼스</label>
                        </div>
                    </div>
                    <div className="NL-selected">
                        카테고리 선택
                    </div>
                    <div className="NL-search-box">
                        <input type="text" placeholder="검색..." />
                    </div>
                </div>
                {/* <div className="NL-campus">
                    <div className="NL-new_theme">분실 캠퍼스</div>
                    <div className="NL-new_sel">
                        <select 
                            className="NL-campus_opt" 
                            name='campus'
                            value={campus}
                            onChange={e => onChange(e)}
                            required
                        >
                            <option value="">선택</option>
                            <option value="M">명륜 캠퍼스</option>
                            <option value="Y">율전 캠퍼스</option>
                        </select>
                    </div>
                </div> */}

                <h2>건물 선택</h2>
                <div className="NL-select-box">
                    <div className="options-container">
                        <div className="option">
                            <input type="radio" className="select" id="M" name="category"/>
                            <label for="M">명륜 캠퍼스</label>
                        </div>
                        <div className="option">
                            <input type="radio" className="select" id="Y" name="category" />
                            <label for="Y">율전 캠퍼스</label>
                        </div>
                    </div>
                    <div className="NL-selected">
                        카테고리 선택
                    </div>
                    <div className="NL-search-box">
                        <input type="text" placeholder="검색..." />
                    </div>
                </div>
                {/* <div className="NL-campus">
                    <div className="NL-new_theme">분실 건물</div>
                    <div className="NL-new_sel">
                        <select 
                            className="NL-campus_opt" 
                            name='building' 
                            value={building}
                            onChange={e => onChangeBuilding(e)} 
                            required
                        >{buildingList}</select>
                    </div>
                </div> */}

                {/*교외 선택했을 시 지도 입력 버튼 나타남*/}
                {mapButton ? mapButtonPop() : noButtonPop()}


                <h2>물품 종류 선택</h2>
                <div className="NL-select-box">
                    <div className="options-container">
                        <div className="option">
                            <input type="radio" className="select" id="M" name="category"/>
                            <label for="M">명륜 캠퍼스</label>
                        </div>
                        <div className="option">
                            <input type="radio" className="select" id="Y" name="category" />
                            <label for="Y">율전 캠퍼스</label>
                        </div>
                    </div>
                    <div className="NL-selected">
                        카테고리 선택
                    </div>
                    <div className="NL-search-box">
                        <input type="text" placeholder="검색..." />
                    </div>
                </div>
                {/* <div className="NL-campus">
                    <div className="NL-new_theme">물품 종류</div>
                    <div className="NL-new_sel">
                        <select 
                            className="NL-campus_opt" 
                            name='item' 
                            value={item} 
                            onChange={e => onChange(e)} 
                            required
                        >
                            <option value=''>선택</option>
                            <option value="전자기기">전자기기</option>
                            <option value="지갑/잡화류">지갑/잡화류</option>
                            <option value="카드/신분증">카드/신분증</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                </div> */}

                <h2>물품 색상 선택</h2>
                <div className="NL-select-box">
                    <div className="options-container">
                        <div className="option">
                            <input type="radio" className="select" id="M" name="category"/>
                            <label for="M">명륜 캠퍼스</label>
                        </div>
                        <div className="option">
                            <input type="radio" className="select" id="Y" name="category" />
                            <label for="Y">율전 캠퍼스</label>
                        </div>
                    </div>
                    <div className="NL-selected">
                        카테고리 선택
                    </div>
                    <div className="NL-search-box">
                        <input type="text" placeholder="검색..." />
                    </div>
                </div>
                {/* <div className="NL-campus">
                    <div className="NL-new_theme">물품 색상</div>
                    <div className="NL-new_sel">
                        <select 
                            className="NL-campus_opt" 
                            name='color' 
                            value={color} 
                            onChange={e => onChange(e)} 
                            required
                        >
                            <option value=''>선택</option>
                            <option value="흰색">흰색</option>
                            <option value="검정">검정</option>
                            <option value="빨강">빨강</option>
                            <option value="노랑">노랑</option>
                            <option value="주황">주황</option>
                            <option value="초록">초록</option>
                            <option value="파랑">파랑</option>
                            <option value="갈색">갈색</option>
                        </select>
                    </div>
                </div> */}

                <h2>분실 일자</h2>
                <div className="NL-select-box">
                    <div className="options-container">
                        <div className="option">
                            <input type="radio" className="select" id="M" name="category"/>
                            <label for="M">명륜 캠퍼스</label>
                        </div>
                        <div className="option">
                            <input type="radio" className="select" id="Y" name="category" />
                            <label for="Y">율전 캠퍼스</label>
                        </div>
                    </div>
                    <div className="NL-selected">
                        카테고리 선택
                    </div>
                    <div className="NL-search-box">
                        <input type="text" placeholder="검색..." />
                    </div>
                </div>
                {/* <h2>분실 일자</h2>
                <div className="NL-campus">
                    <div className="NL-new_theme">분실 일자</div>
                    <div className="NL-new_sel">
                        <input
                            type='date'
                            name='date'
                            value={date}
                            onChange={e => onChange(e)}
                            required
                        />
                    </div>
                </div> */}
            </div>
            <button className="NL-new_next" onClick={e => nextPage(e)}>다음</button>
        </div>
    );

    const page2 = () => (
        <div>
            <div className="NL-new_exp" id='pg2'>
                <h2>상세정보 입력</h2>
                <p>습득자가 분실물을 더 쉽게 찾아드릴 수 있도록 <br/> 상세 설명이나 사진 등을 추가해주세요!</p>
            </div>
            <div className="NL-new_insert_img">
                <img src={cssImage} />
            </div>
            <div className="NL-new_img_button">
            <label className="NL-input-file-button" htmlFor="input-file">
                    { image === null ? '사진 업로드' : '사진 수정' }
                </label>
                <input
                    type='file'
                    accept='image/*'
                    name='image'
                    id='input-file'
                    onChange={e => onChangeImage(e)}
                    style={{display:'none'}}
                />
            </div>
            <div className="NL-new_title_input">
                <input 
                    type="text" 
                    placeholder="게시물 제목" 
                    name='title' 
                    value={title} 
                    onChange={e => onChange(e)} 
                    required 
                />
            </div>
            <div className="NL-new_place_input">
                <input 
                    type="text" 
                    placeholder="분실 장소명" 
                    name='location' 
                    value={location} 
                    onChange={e => onChange(e)} 
                    required 
                />
            </div>
            <div className="NL-new_content_input">
                <p><textarea
                    name='content'
                    value={content}
                    onChange={e => onChange(e)}
                    placeholder="
                    상세 정보 및 특이사항
                    &#13;&#10;
                    <이용 시 주의사항>
                    스꾸실 개발팀은 분실물 중개 기능 제공과 유지/보수에만 그 역할이 있으며 분실물 등록 및 반환 과정에서의 도난, 절도와 같은 사고에는 일절 책임을 지지 않습니다.

                    때문에 스꾸실 이용 시 허위 반환 요청에 주의하시고, 타인의 유실물을 임의로 탈취할 경우, 유실물법에 근거하여 점유이탈물횡령죄로 처벌받을 수 있음을 알려드립니다.

                    도배성 게시글 작성 방지를 위해 1일 1게시글 정책을 시행중이며, 허위/광고글 작성 시 사전 경고 없이 삭제 및 회원탈퇴 조치될 수 있습니다." 
                    required
                    /></p>
            </div>
            <button className="NL-new_complete" type='submit'> 등록하기 </button>
        </div>
    );

    return(
        <div>
            <header className="NL-header">
                <div className="NL-back">
                    <button onClick="history.back()"><i className="fa fa-chevron-left"></i></button>
                </div> 
                <h2>분실물 등록</h2>
            </header>
            <form onSubmit={e => onSubmit(e)}>
                {/* 다음 버튼 눌렀을 시 page의 값이 바뀌면서 page가 이동함 */}
                {page ? page1() : page2 ()}
            </form>
        </div>
        // <div>
        //     <header className="NL-header"> 
        //         <h2>분실물 등록</h2>
        //     </header>
        //     <div className="NL-back">
        //         <button onClick="history.back()"><i className="fa fa-chevron-left"></i></button>
        //     </div>
        //     <form onSubmit={e => onSubmit(e)}>
        //         {/* 다음 버튼 눌렀을 시 page의 값이 바뀌면서 page가 이동함 */}
        //         {page ? page1() : page2 ()}
        //     </form>
        // </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    _user: state.auth.user
});

export default connect(mapStateToProps, { read, create })(New_lost);