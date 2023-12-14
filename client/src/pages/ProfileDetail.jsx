import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { IoMdFingerPrint } from "react-icons/io";
import { FaIdCard } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';


const ProfileDetail = () => {
    const userId = useParams();
    const dispatch = useDispatch()
    console.log("Check userId:", userId.id)
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [fingerprint, setFingerPrint] = useState(null);
    const [rfid, setRfid] = useState(null);



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/profile-detail/${userId.id}`);
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    // Xử lý khi có lỗi hoặc user không tồn tại
                    console.error(data.message || 'User not found');
                    // Redirect về trang trước đó nếu có lỗi hoặc user không tồn tại
                    return;
                }
                setUser(data);

                // Phân loại biometrics theo method và lưu vào state
                const biometricsByMethod = data.biometrics.reduce((acc, biometric) => {
                    const { method } = biometric;
                    // Kiểm tra xem mảng cho method đã tồn tại chưa, nếu chưa thì tạo mới
                    acc[method] = acc[method] || [];
                    // Thêm biometric vào mảng tương ứng với method
                    acc[method].push(biometric);
                    return acc;
                }, {});

                // Lưu biometrics vào state tương ứng
                setFingerPrint(biometricsByMethod.fingerprint || []);
                setRfid(biometricsByMethod.RFID || []);

            } catch (error) {
                console.error(error);
            }
        };

        // Gọi hàm fetchUserData khi userId.id thay đổi hoặc component được mount
        fetchUserData();
    }, []); // Thêm [] để đảm bảo useEffect chỉ chạy một lần sau khi component mount

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${user.userID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (data.success == false) {
                dispatch(updateUserFailure(data.message))
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true)
            console.log(loading)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }

    const handleGetBiometric = async ({ userId, method }) => {
        try {
            const response = await fetch(`/api/user/current-userid/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, method }),
            });

            if (!response.ok) {
                throw new Error(`Yêu cầu thất bại với mã trạng thái: ${response.status}`);
            }

            const data = await response.json();
            console.log("response: ", data); // Bạn có thể xử lý dữ liệu phản hồi ở đây

        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleUpdateBiometric = async (userId) => {
        try {
            const response = await fetch(`/api/user/current-userid/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, method }),
            });

            if (!response.ok) {
                throw new Error(`Yêu cầu thất bại với mã trạng thái: ${response.status}`);
            }

            const data = await response.json();
            console.log("response: ", data); // Bạn có thể xử lý dữ liệu phản hồi ở đây

        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleDeleteBiometric = async ({ userId, method }) => {
        try {
            const response = await fetch(`/api/user/delete-biometric/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, method }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                // Đưa ra quyết định xử lý dữ liệu phản hồi tại đâ            } else {
                console.error(`Yêu cầu thất bại với mã trạng thái: ${response.status}`);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };




    return (
        <>
            <div className='w-44 flex float-left mt-24' >
                <button className="bg-gray-700 w-full py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
            <form onSubmit={handleSubmit} className="flex h-1/2 flex-col">
                <div className="mx-4 mt-24 flex flex-row justify-center bg-white p-4 rounded-lg shadow-lg text-slate-600 gap-3">
                    <div className='w-1/3 rounded-md justify-center flex border'>
                        <div className='flex flex-col w-full mx-4'>
                            <div className='flex justify-center h-1/6'>
                                <img src={user.avatar} alt="profile avatar" className='h-full mt-3 rounded-full' />
                            </div>

                            <div className='mt-4 w-full'>
                                <tr class="flex flex-col dark:bg-gray-800 dark:border-gray-700">
                                    <th className='w-2/3 text-sm mx-2 text-violet-900'>Username</th>
                                    <td scope="row" class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white">
                                        {user.username}
                                    </td>
                                    <th className='w-2/3 text-sm mx-2 text-violet-900'>Email</th>
                                    <td class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white">
                                        {user.email}
                                    </td>
                                    <th className='w-2/3 text-sm mx-2 text-violet-900'>Role</th>
                                    <td class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white">{user.role}</td>


                                    <div className='flex flex-row justify-between'>
                                        <div className='flex w-2/3' >
                                            <button className="w-1/2 flex justify-center items-center bg-red-500 py-2 shadow-xl rounded-lg text-white hover:bg-red-800 duration-500">
                                                <FaRegTrashAlt />
                                            </button>
                                        </div>
                                        <div className='flex w-2/3 justify-end' >
                                            <button className="w-1/2 flex justify-center items-center bg-green-600 py-2 shadow-xl rounded-lg text-white hover:bg-green-800 duration-500">
                                                <FaCheck />
                                            </button>
                                        </div>
                                    </div>
                                </tr>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col float-right gap-2 w-2/3 rounded border p-3'>
                        <h2 className="text-3xl text-center font-bold">User Profile</h2>
                        <div className="flex flex-col float-left gap-3 ml-2">
                            <div className="flex flex-col gap-3 ml-2">
                                <div className="flex flex-col">
                                    <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Phone number</label>
                                    <input onChange={handleChange} defaultValue={user.phonenumber} id="phonenumber" placeholder="phone number..." className="px-6 py-2 border mb-2 rounded font-medium text-sm dark:text-white" />

                                    <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Address</label>
                                    <input onChange={handleChange} defaultValue={user.address} id="address" placeholder="..." className="px-6 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />

                                    <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Department</label>
                                    <input onChange={handleChange} defaultValue={user.department} id="department" placeholder="Department" className="px-6 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-row'>
                                    <IoMdFingerPrint className='w-6 h-6 text-gray-500' />
                                    <th className='text-sm mx-2 text-violet-900'>Fingerprint</th>
                                </div>

                                {fingerprint && fingerprint.length > 0 ? (
                                    // Nếu fingerprint tồn tại và có dữ liệu, hiển thị nội dung tương ứng
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-green-600 bg-green-100 rounded font-medium text-sm text-green-600 whitespace-nowrap dark:text-white">Đã có dữ liệu</td>
                                        <Link onClick={() => handleGetBiometric({ userId: user.userID, method: 'fingerprint' })} className='flex self-center text-center'>
                                            <button className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                Update
                                            </button>
                                        </Link>
                                        <Link onClick={() => handleDeleteBiometric({ userId: user.userID, method: 'fingerprint' })} className='flex self-center items-center text-center'>
                                            <button className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-red-600 hover:bg-red-900 hover:scale-105 duration-500'>
                                                <span>Delete</span>
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    // Ngược lại, hiển thị chuỗi "Chưa có"
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-red-600 bg-red-100 rounded font-medium text-sm text-left text-red-600 whitespace-nowrap dark:text-white">Chưa có dữ liệu</td>
                                        <Link onClick={() => handleGetBiometric({ userId: user.userID, method: 'fingerprint' })} className='flex self-center items-center text-center'>
                                            <button className='p-2 h-9 w-12 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                <FaPlus />
                                            </button>
                                        </Link>
                                    </div>
                                )}

                                <div className='flex flex-row'>
                                    <FaIdCard className='w-6 h-6 text-gray-500' />
                                    <th className='text-sm mx-2 text-violet-900'>RFID</th>
                                </div>
                                {rfid && rfid.length > 0 ? (
                                    // Nếu card tồn tại và có dữ liệu, hiển thị nội dung tương ứng
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-green-600 bg-green-100 rounded font-medium text-sm text-left text-green-600 whitespace-nowrap dark:text-white">Đã có dữ liệu</td>
                                        <Link onClick={() => handleGetBiometric({ userId: user.userID, method: 'RFID' })} className='flex self-center text-center'>
                                            <button className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                Update
                                            </button>
                                        </Link>
                                        <Link onClick={() => handleDeleteBiometric({ userId: user.userID, method: 'RFID' })} className='flex self-center text-center'>
                                            <button className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-red-600 hover:bg-red-900 hover:scale-105 duration-500'>
                                                Delete
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    // Ngược lại, hiển thị chuỗi "Chưa có dữ liệu"
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-red-600 bg-red-100 rounded font-medium text-sm text-left text-red-600 whitespace-nowrap dark:text-white">Chưa có dữ liệu</td>
                                        <Link onClick={() => handleGetBiometric({ userId: user.userID, method: 'RFID' })} className='flex self-center text-center'>
                                            <button className='p-2 h-9 w-12 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                <FaPlus />
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ProfileDetail;
