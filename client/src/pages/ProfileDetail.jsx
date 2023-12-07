import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { IoMdFingerPrint } from "react-icons/io";
import { FaIdCard } from "react-icons/fa";
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
    const [card, setCard] = useState(null);

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
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/get-biometric/${userId.id}`);
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    // Xử lý khi có lỗi hoặc user không tồn tại
                    console.error(data.message || 'User not found');
                    // Redirect về trang trước đó nếu có lỗi hoặc user không tồn tại
                    return;
                }

                setFingerPrint(data.biometrics);
                setCard(data.biometrics)
                console.log(typeof fingerprint);
                if (!fingerprint) {
                    console.log("Check biooooo: ", fingerprint)
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

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

    const handleGetFingerprint = async (userId) => {
        try {
            const esp32Endpoint = 'your-esp32-endpoint';
            const response = await axios.get(`${esp32Endpoint}/biometric/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.status === 200) {
                console.error(`Request to ESP32 failed with status: ${response.status}`);
                return;
            }

            const biometricData = response.data;

            // Now, send the biometric data to your server for saving
            const saveBiometricResponse = await axios.post('/api/user/save-biometric', {
                userId,
                biometricData,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!saveBiometricResponse.status === 200) {
                console.error(`Failed to save biometric data with status: ${saveBiometricResponse.status}`);
                // Handle the error as needed
            } else {
                const saveBiometricResult = saveBiometricResponse.data;
                console.log('Response from server:', saveBiometricResult);
                // Handle the success or further logic
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };

    const handleGetRFID = async (userId) => {
        try {
            const esp32Endpoint = 'your-esp32-endpoint';
            const response = await axios.get(`${esp32Endpoint}/biometric/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.status === 200) {
                console.error(`Request to ESP32 failed with status: ${response.status}`);
                return;
            }

            const biometricData = response.data;

            // Now, send the biometric data to your server for saving
            const saveBiometricResponse = await axios.post('/api/user/save-biometric', {
                userId,
                biometricData,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!saveBiometricResponse.status === 200) {
                console.error(`Failed to save biometric data with status: ${saveBiometricResponse.status}`);
                // Handle the error as needed
            } else {
                const saveBiometricResult = saveBiometricResponse.data;
                console.log('Response from server:', saveBiometricResult);
                // Handle the success or further logic
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };


    return (
        <>
            <div className='w-1/6 float-left mt-24 ml-24 flex' >
                <button className="bg-gray-700 w-1/2 py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col w-4/6 my-8">
                <div className="my-24 mr-10 flex flex-row justify-center bg-white h-1/6 p-4 rounded-lg shadow-lg text-slate-600 gap-3">
                    <div className='w-1/3 rounded justify-center flex border'>
                        <div className='flex flex-col'>
                            <div className='flex justify-center h-1/6'>
                                <img src={user.avatar} alt="profile avatar" className='h-full mt-3 rounded-full' />
                            </div>

                            <div className='mt-4'>
                                <tr class="flex flex-col dark:bg-gray-800 dark:border-gray-700">
                                    <th className='text-sm mx-2 text-violet-900'>Username</th>
                                    <td scope="row" class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white">
                                        {user.username}
                                    </td>
                                    <th className='text-sm mx-2 text-violet-900'>Email</th>
                                    <td class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white">
                                        {user.email}
                                    </td>
                                    <th className='text-sm mx-2 text-violet-900'>Role</th>
                                    <td class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white">{user.role}</td>
                                    <th className='text-sm mx-2 text-violet-900'>Fingerprint</th>
                                    {fingerprint && fingerprint.length > 0 ? (
                                        // Nếu fingerprint tồn tại và có dữ liệu, hiển thị nội dung tương ứng
                                        <td className="px-2 py-2 border-1 border-green-600 bg-green-100 mb-2 rounded font-medium text-sm text-green-600 whitespace-nowrap dark:text-white">Đã có dữ liệu</td>
                                    ) : (
                                        // Ngược lại, hiển thị chuỗi "Chưa có"
                                        <td className="px-2 py-2 border-1 border-red-600 bg-red-100 mb-2 rounded font-medium text-sm text-red-600 whitespace-nowrap dark:text-white">Chưa có dữ liệu</td>
                                    )}

                                    <th className='text-sm mx-2 text-violet-900'>RFID</th>
                                    {card && card.length > 0 ? (
                                        // Nếu card tồn tại và có dữ liệu, hiển thị nội dung tương ứng
                                        <td className="px-2 py-2 border-1 border-green-600 bg-green-100 mb-2 rounded font-medium text-sm text-green-600 whitespace-nowrap dark:text-white">Đã có dữ liệu</td>
                                    ) : (
                                        // Ngược lại, hiển thị chuỗi "Chưa có"
                                        <td className="px-2 py-2 border-1 border-red-600 bg-red-100 mb-2 rounded font-medium text-sm text-red-600 whitespace-nowrap dark:text-white">Chưa có dữ liệu</td>
                                    )}
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
                        </div>

                        <div className='flex justify-center gap-2'>

                            <button className="bg-red-700 py-2 w-1/4 shadow-xl rounded-lg text-white hover:bg-red-900 duration-500">
                                Delete
                            </button>
                            <button className="bg-violet-600 py-2 w-1/4 shadow-xl rounded-lg text-white hover:bg-violet-900 duration-500">
                                Update
                            </button>
                            <Link onClick={() => handleGetFingerprint(user.userID)} className='flex self-center text-center'>
                                <button className='p-2 ml-2 flex justify-start rounded-full text-center text-white bg-green-600 hover:bg-green-900 hover:scale-125 duration-500'>
                                    <IoMdFingerPrint />
                                </button>
                            </Link>
                            <Link onClick={() => handleGetRFID(user.userID)} className='flex self-center text-center'>
                                <button className='p-2 flex justify-start rounded-full text-center text-white bg-yellow-600 hover:bg-yellow-900 hover:scale-125 duration-500'>
                                    <FaIdCard />
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </form>
        </>
    );
};

export default ProfileDetail;
