import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { UserIcon, EnvelopeIcon, PhoneIcon, UsersIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '../components/Input';
import { useAuthStore } from '../store/authStore';

const AddReservation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        cottageId: '',
        cottageName: '',
        cottagePrice: '',
        guestName: '',
        email: '',
        contactNumber: '',
        numberOfGuest: 1,
        address: '',
        checkIn: '',
        checkOut: '',
        payment: '',
        proofOfPayment: null,
        termsAgreed: false
    });


    const [isLoading, setIsLoading] = useState(false);

    const cottageOptions = [
        { id: 'pondside', label: 'Pondside Cottage', price: 100 },
        { id: 'largekubo', label: 'Large Kubo Cottage', price: 120 },
        { id: 'umbrella', label: 'Umbrella Cottage', price: 80 },
        { id: 'kubo', label: 'Kubo Cottage', price: 90 },
        { id: 'rock', label: 'Rock Cottage', price: 70 }
    ];



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckInChange = (e) => {
        const checkInDate = e.target.value;
        if (checkInDate) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setValues(prev => ({
                ...prev,
                checkIn: checkInDate,
                checkOut: nextDay.toISOString().split('T')[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const requiredFields = {
            cottageId: 'Please select a cottage',
            guestName: 'Full name is required',
            email: 'Email is required',
            contactNumber: 'Phone number is required',
            address: 'Address is required',
            checkIn: 'Check-in date is required',
            checkOut: 'Check-out date is required'
        };
    
        for (const [field, message] of Object.entries(requiredFields)) {
            if (!values[field]) {
                toast.error(message);
                return;
            }
        }
    
        if (!/^\d{11}$/.test(values.contactNumber)) {
            toast.error('Phone number must be 11 digits');
            return;
        }
    
        if (values.numberOfGuest < 1) {
            toast.error('Number of guests must be at least 1');
            return;
        }
    
        if (new Date(values.checkOut) <= new Date(values.checkIn)) {
            toast.error('Check-out must be after check-in');
            return;
        }
    
        setIsLoading(true);
    
        try {
            await useAuthStore.getState().createReservation(values);  // Make sure this creates the reservation correctly in your backend
            toast.success('Reservation created!');
            navigate("/dashboard/pending-reservation");  // Redirect to PendingReservations
        } catch (error) {
            toast.error(error.message || 'Reservation failed');
        } finally {
            setIsLoading(false);
        }
    };
    

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-white rounded-lg shadow-md py-3 px-8 border-[1px] border-gray-200">
                    <h1 className="text-2xl font-bold text-center text-blue-600 pt-2 mb-4">Create New Reservation</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Cottage Info */}
                        <div className="mb-6">
                            <label htmlFor="cottageId" className="block text-gray-700 mb-2">Select a Cottage</label>
                            <select
                                name="cottageId"
                                id="cottageId"
                                value={values.cottageId}
                                onChange={(e) => {
                                    const selected = cottageOptions.find(opt => opt.id === e.target.value);
                                    setValues(prev => ({
                                        ...prev,
                                        cottageId: selected?.id || '',
                                        cottageName: selected?.label || '',
                                        cottagePrice: selected?.price || ''
                                    }));
                                }}
                                required
                                className="w-full border-gray-300 rounded-md p-2"
                            >
                                <option value="">-- Choose a cottage --</option>
                                {cottageOptions.map((cottage) => (
                                    <option key={cottage.id} value={cottage.id}>
                                        {cottage.label}
                                    </option>
                                ))}
                            </select>
                            {values.cottageId && (
                                <div className="bg-blue-100 p-4 mt-4 rounded-lg border-l-4 border-blue-500">
                                    <h2 className="text-lg font-semibold text-blue-800">{values.cottageName}</h2>
                                    <p className="text-gray-600">₱{values.cottagePrice}/head</p>
                                </div>
                            )}

                        </div>


                        <Input label="Full Name" name="guestName" icon={UserIcon} value={values.guestName} onChange={handleInputChange} required />
                        <Input label="Email Address" name="email" type="email" icon={EnvelopeIcon} value={values.email} onChange={handleInputChange} required />
                        <Input label="Phone Number" name="contactNumber" type="tel" icon={PhoneIcon} value={values.contactNumber} onChange={handleInputChange} maxLength={11} required />
                        <Input label="Number of Guests" name="numberOfGuest" type="number" icon={UsersIcon} value={values.numberOfGuest} onChange={handleInputChange} min={1} required />
                        <Input label="Address" name="address" icon={MapPinIcon} value={values.address} onChange={handleInputChange} required />
                        <Input label="Check-in Date" name="checkIn" type="date" icon={CalendarIcon} value={values.checkIn} onChange={handleCheckInChange} min={new Date().toISOString().split('T')[0]} required />
                        <Input label="Check-out Date" name="checkOut" type="date" icon={CalendarIcon} value={values.checkOut} onChange={handleInputChange} min={values.checkIn || new Date().toISOString().split('T')[0]} required />

                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center mt-6"
                            disabled={isLoading}
                        >
                            Submit
                            {!isLoading && <PaperAirplaneIcon className="w-5 h-5 ml-2" />}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddReservation;
