import React, { useState, useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { detail } from '../actions/apost';
import '../style/search_lost.css';
import '../style/filter.css';
import cssImage from '../img/skkulogo.png';

const Search_lost = ({ isAuthenticated, lists, detail }) => {
    let history = useHistory();
    const [linkSAL, setLinkSAL] = useState(false);

    if (lists[0].id < lists[1].id) {
        lists.sort((a, b) => b.id - a.id);
    }

    useEffect(() => {
        if (isAuthenticated) {
            document.body.className='SL-body';
        }
    });
    
    const [searchItem, setSearchItem] = useState("");
    
    const [selectedFilter, setSelectedFilter] = useState({
        lost_found:'',
        campus:'',
        building:'',
        item:'',
        color:'',
        date:''
    });

    const [filterList, setFilterList] = useState(lists);

    const [filter, setFilter] = useState(false);
    // 이미지 null 값일 경우 기본 이미지로 세팅
    // const [imageDefault, setImageDefault] = useState(lists);

    useEffect(() => {
        setFilterList(lists)
    }, [lists]);

    const {lost_found, campus, building, item, color, date} = selectedFilter;

    if (!isAuthenticated) {
        return <Redirect to = '/login' />
    }

    if (linkSAL) {
        return <Redirect to = '/studentaid_lost' />
    };

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        let searchList = lists;
        if (searchItem) {
            
            searchList = searchList.filter((list) => list.location.match(searchItem));

            if (Object.keys(searchList).length === 0) {
                searchList = lists;
                searchList = searchList.filter((list) => list.content.match(searchItem));

                if (Object.keys(searchList).length === 0) {
                    searchList = lists;
                    searchList = searchList.filter((list) => list.title.match(searchItem));

                    if (Object.keys(searchList).length === 0) {
                        searchList = lists;
                        searchList = searchList.filter((list) => list.item.match(searchItem));

                        if (Object.keys(searchList).length === 0) {
                            searchList = lists;
                            searchList = searchList.filter((list) => list.building.match(searchItem));
                        }
                    }
                }
                
            }
        }
        setFilterList(searchList);
    }

    const filtering = () => {
        let filteringList = lists;
        if (lost_found) {
            filteringList = filteringList.filter((list) => list.lost_found === lost_found);
        }
        if (campus) {
            filteringList = filteringList.filter((list) => list.campus === campus);
        }
        if (building) {
            filteringList = filteringList.filter((list) => list.building === building);
        }
        if (item) {
            filteringList = filteringList.filter((list) => list.item === item);
        }
        if (color) {
            filteringList = filteringList.filter((list) => list.color === color);
        }
        if (date) {
            filteringList = filteringList.filter((list) => list.date === date);
        }
        setFilterList(filteringList);
    }

    const handleChange = (e) => {
        setSelectedFilter({...selectedFilter, [e.target.name]: e.target.value});
        console.log(e.target.name, e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.dir(selectedFilter);
        filtering();
    }

    let renderList = filterList.map((list) => {
        
        if (list.lost_found === 'L') {
            return (
                <Link
                    to= '/loading'
                    onClick={e => getDetail(list.id, e)}
                    >
                    {/* 개인습득물 - 개별 아이템 indiItem */}
                    <ul className="indi_list">
                        <li>
                            <div className="indItem_img">
                                <img src={list.image !== null ? list.image : cssImage} />
                            </div>
                            <div className="indItem-info">
                                <span className="indItem-name"> {list.title} </span>
                                <span className="indItem-date"> {list.create_date.slice(0,10)} </span>
                                <br/>
                                <br/>
                                <div className="indItem-loca"> [{list.campus === 'M' ? '명륜 캠퍼스' : '율전 캠퍼스'} / {list.building}]</div>
                                <span className="indItem-sort"> {list.item} </span>
                                <span className="indItem-color"> {list.color} </span>
                            </div>
                        </li>
                    </ul>
                </Link>
            );
        }
    });

    const getDetail = (id, e) => {
            detail(id);
        };

    const studentAidLost = (e) => {
        e.preventDefault();
        setLinkSAL(true);
    };

    const goBack = () => {
        history.goBack();
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        setFilter(true);
    }

    const handleFButtonClick = (e) => {
        e.preventDefault();
        setFilter(false);
    }

    const listPage = () => (
        <div>
            {/* header */}
            <div className="SL-header">
                {/* 뒤로가기 버튼 */}
                <div className="SL-back">
                    <button onClick={goBack}><i className="fa fa-chevron-left"></i></button>
                </div>
                <h2>분실물 게시판</h2>
                <div className="SL-filter">
                    {/* <a href="./filter.html"> */}
                        <button onClick={e => handleButtonClick(e)}>Filter</button>
                        {/* </a> */}
                </div>
            </div>
            <form onSubmit= {e => handleSearchSubmit(e)}>
                <div className="SL-search_container">
                    <input 
                        type="text"
                        value={searchItem}
                        className="SL-search_text" 
                        placeholder="분실물 검색"
                        onChange= {e => handleSearch(e)}
                    />
                    <button type="submit" className="SL-search_btn">검색</button>
                </div> 
            </form>
            {/* 검색 옵션 search_option (개인습득물 or 학생지원팀) */}
            <div className="SL-search_option">
                <button type="button" className="SL-Indi_btn SL-circle_btn">개인분실물</button>
                <button type="button" className="SL-Offi_btn" onClick={e => studentAidLost(e)}>학생지원팀</button>
            </div>
            {/* 개인습득물 전체 틀 indi_list */}
            <div className="indi_item">
                {renderList}
            </div>
        </div>
    );

    const filterPage = () => (
        <div>
            <div className="filter_title">
                <h2>카테고리 필터</h2>
            </div>
            <div className="F-container">
                <h2>캠퍼스</h2>
                <div className="F-select-box">
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
                <div className="F-selected">
                    카테고리 선택
                </div>
                <div className="F-search-box">
                    <input type="text" placeholder="검색..." />
                </div>
            </div>

        <h2>습득 위치</h2>
        <div className="F-select-box">
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
          <div className="F-selected">
            카테고리 선택
          </div>
          <div className="F-search-box">
            <input type="text" placeholder="검색..." />
          </div>
        </div>

        <h2>습득 물품 종류</h2>
        <div className="F-select-box">
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
          <div className="F-selected">
            카테고리 선택
          </div>
          <div className="F-search-box">
            <input type="text" placeholder="검색..." />
          </div>
        </div>

        <h2>색상</h2>
        <div className="F-select-box">
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
          <div className="F-selected">
            카테고리 선택
          </div>
          <div className="F-search-box">
            <input type="text" placeholder="검색..." />
          </div>
        </div>

        <h2>습득 날짜</h2>
        <div className="F-select-box">
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
          <div className="F-selected">
            카테고리 선택
          </div>
          <div className="F-search-box">
            <input type="text" placeholder="검색..." />
          </div>
        </div>


      </div>
    
    <div className="filter-btn-container">
        <button type="submit" className="filter-savebtn" onclick = {e => handleFButtonClick(e)}>적용하기</button>
    </div>
    </div>
    );
    return(

        <div>
            
            {filter? filterPage() : listPage()}
            {/* 검색창 / search_container */}
            
        </div>

        // <form onSubmit={e => handleSubmit(e)}>
        //     <label>
        //         FILTER
        //         <select name="lost_found" value={lost_found} onChange= {e => handleChange(e)}>
        //             <option value="">분실/습득</option>
        //             <option value="분실물">분실물</option>
        //             <option value="습득물">습득물</option>
        //         </select>
        //         <select name="campus" value={campus} onChange= {e => handleChange(e)}>
        //             <option value="">캠퍼스</option>
        //             <option value="명륜">명륜</option>
        //             <option value="율전">율전</option>
        //         </select>
        //         <select name="building" value={building} onChange= {e => handleChange(e)}>
        //             <option value="">학관</option>
        //             <option value='퇴계인문관'>퇴계인문관</option>
        //             <option value='경영관'>경영관</option>
        //             <option value='다산경제관'>다산경제관</option>
        //             <option value='수선관'>수선관</option>
        //             <option value='호암관'>호암관</option>
        //             <option value='법학관'>법학관</option>
        //             <option value='중앙학술정보관'>중앙학술정보관</option>
        //             <option value='600주년 기념관'>600주년 기념관</option>
        //             <option value='학생회관'>학생회관</option>
        //             <option value='교수회관'>교수회관</option>
        //             <option value='양현관'>양현관</option>
        //             <option value='교외 (학교 주변)'>교외 (학교 주변)</option>
        //         </select>
        //         <select name="item" value={item} onChange= {e => handleChange(e)}>
        //             <option value="">물품 종류</option>
        //             <option value="전자기기">전자기기</option>
        //             <option value="지갑/잡화류">지갑/잡화류</option>
        //             <option value="카드/신분증">카드/신분증</option>
        //             <option value="기타">기타</option>
        //         </select>
        //         <select name="color" value={color} onChange= {e => handleChange(e)}>
        //             <option value="">색상</option>
        //             <option value="빨간색">빨간색</option>
        //             <option value="파란색">파란색</option>
        //         </select>
        //         <input type="date" placeholder="날짜" name="date" value={date} onChange = {e => handleChange(e)}></input>
        //     </label>
        //     <input type="submit" value="Submit" />
        // </form>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    lists: state.post._datas
});

export default connect(mapStateToProps, {detail})(Search_lost);