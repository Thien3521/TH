import React, { useEffect, useRef, useState } from 'react'
import { apiLoggedInInstance } from '../../../utils/api';
import Modal from '../../../components/Modal';

const NganhNghe = () => {
   const buttonRef = useRef();
    const [data, setData] = useState([]); // lưu data từ api về
    const [currentPage, setCurrentPage] = useState(1); // lưu thông tin trang hiện tại
    const [pageSize, setPageSize] = useState(10); // số phần tử 1 trang
    const [totalPage, setTotalPage] = useState(1); // lưu tổng số
    const [paginatedData, setPaginatedData] = useState([]); // lưu data sau khi xử lý phần trang để hiển thị ra màn hình
    const [showModal, setShowModal] = useState(false); // show modal thêm
    const [inputValue, setInputValue] = useState({
        code: "",
        name: ""
    })
    const [errorMsg, setErrorMsg] = useState({
        code: "",
        name: ""
    })

    // lấy dữ liệu từ api về
    const getData = () => {
        apiLoggedInInstance({
            url: '/api/field'
        }).then(response => {
            setData(response.data);
            setTotalPage(Math.ceil(response.data.length / pageSize));
        })
    }

    const handleClose = () => {
        setShowModal(false);
        // do sth
    }

    const handleCreate = () => {
        if(inputValue.name === ""){
            setErrorMsg(pre => ({...pre, name: "Ten khong duoc de trong"}));
        }
        if(inputValue.code === ""){
            setErrorMsg(pre => ({...pre, code: "Ma khong duoc de trong"}));
        }
        if(inputValue.code === "" || inputValue.name === "") return;
        apiLoggedInInstance({
            url: '/api/field',
            params: {
                name: inputValue.name,
                code: inputValue.code,
            },
            method: "POST"
        }).then(res=> {
            if(res.data){
                getData();
                handleClose();
                setInputValue({name: "", code: ""});
            }
        })
    }

    // 
    useEffect(() => {
       getData();
    }, [])

    // xử lý phân trang dữ liệu
    useEffect(() => {
        // 0 - 10,
        // 10 - 20
        // 20 - 30
        const paginate = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setPaginatedData(paginate)
        setInterval(() => console.log("123") , 1000)
        return () => {
            setPaginatedData([]);
        }
    },[data, currentPage, pageSize]) // bắt state thay đổi 
    
    return (
        <div className='w-full'>
            <div className='border w-full flex justify-between'>
                <div >Ngành nghề ({data.length})</div>
                <div><button ref={buttonRef} onClick={() => {
                    console.log("click");
                    setShowModal(true)
                }} className='border rounded p-2 border-[#000]'>Thêm ngành nghề </button></div>
            </div>
            <table className='w-full'>
                <thead>
                    <tr className='border'>
                        <th className='border'>STT</th>
                        <th className='border'>*</th>
                        <th className='border'>Mã ngành nghề</th>
                        <th className='border'>Tên Ngành nghề</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 && (
                        <tr className='border'>
                            <td className='border' colSpan={4}>Không dữ liệu</td>
                        </tr>
                    )}
                    {paginatedData.map((field, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td></td>
                            <td>{field.code}</td>
                            <td>{field.name}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4}>
                            {[...Array(totalPage)].map((_, index) => {
                              return  (
                                <button
                                onClick={() => {
                                    setCurrentPage(index+1)
                                }}
                                style={{
                                    backgroundColor: currentPage === index+ 1 && "blue"
                                }}
                              className='border p-2 border-[#000]'>{index+1}</button>
                              )
                            })}
                            Tổng số trang: {totalPage}
                            <div>
                                <select onChange={(e) => {
                                    setPageSize(e.target.value)
                                }}>
                                    <option value={10}>10/ trang</option>
                                    <option value={20}>20/ trang</option>
                                </select>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            {showModal && (
                <Modal title="Thêm ngành nghề" onClose={handleClose}>
                   <div className='w-full'>
                       <div> 
                            <input value={inputValue.code} placeholder='Mã ngành nghề' onChange={(event) => {
                                setInputValue(pre => ({ ...pre, code: event.target.value }))
                                setErrorMsg(pre => ({...pre, code: ""}))
                            }} autoFocus />
                            {errorMsg.code !== "" && <span className='text-[red]'>{errorMsg.code}</span>}
                       </div>
                       <div> 
                            <input value={inputValue.name} onChange={(event) => {
                                setInputValue(pre => ({ ...pre, name: event.target.value }))
                            }} placeholder='Tên ngành nghề' />
                       </div>
                       <button onClick={handleCreate}>Thêm</button>
                   </div>
                </Modal>

            )}
        </div>
    )
}

export default NganhNghe