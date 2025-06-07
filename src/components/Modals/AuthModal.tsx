import { useState } from "react";
import type { DefaultModalProps } from "../../../types"
import Modal from "../UI/Modal"
import Button from "../UI/Button";
import { login, register } from "../../supabase";
import { useAppState } from "../../StateProvider";

type Props = DefaultModalProps

export default function AuthModal({isOpen}: Props) {
    const [type, setType] = useState<'login' | 'register'>('login');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { setUser } = useAppState() 

    const activeClass = "bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold";

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();

        if (type === 'login') {
            // Handle login logic
            console.log('Logging in with:', { username, password });
            const { data: user, error } = await login(username, password);
            if (!user || error) {
                alert('Login failed: ' + (error));
            } else {
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setUser(user);
            }

            setLoading(false);

        } else {
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                setLoading(false);
                return;
            }

            const { data: user, error } = await register(username, password);
            if (!user || error) {
                alert('Registration failed: ' + (error));
            }
            else {
                setUser(user);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            }

            setLoading(false);

        }
    }

    return (
        <Modal
            isOpen={isOpen}
            classname="!p-0"
            >
               <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 lg:rounded-t-lg text-center lg:text-start">
                    <p className="text-white font-bold text-2xl">Welcome to Roadrunner</p>
                    <p className="text-gray-100">Track your lap times and compete with friends</p>
               </div>
               <div className="p-4 pt-3">
                <div className="tabs w-full flex bg-gray-200 p-1 gap-2 rounded-lg">
                    <button className={`w-full bg-white text-gray-700 rounded-lg px-3 py-2 text-center font-semibold cursor-pointer transition-colors duration-100 ${type === 'login' ? activeClass : ''}`} onClick={() => setType('login')}>
                        Sign In
                    </button>
                    <button className={`w-full bg-white text-gray-700 rounded-lg px-3 py-2 text-center font-semibold cursor-pointer transition-colors duration-100 ${type === 'register' ? activeClass : ''}`} onClick={() => setType('register')}>
                        Sign Up
                    </button>
                </div>
               </div>

               <form onSubmit={handleSubmit}>
                    <div className="p-4 pt-0">
                        <label className="block text-gray-700 mb-2 font-semibold">Username (no spaces)</label>
                        <input pattern="^\S*$" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="p-4 pt-0">
                        <label className="block text-gray-700 mb-2 font-semibold">Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder={type === 'login' ? 'Enter your password' : 'Create a password'} required minLength={6} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    {type === 'register' && <div className="p-4 pt-0">
                        <label className="block text-gray-700 mb-2 font-semibold">Confirm Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Confirm your password" required onChange={(e) => {setConfirmPassword(e.target.value)}}/>
                        </div>
                    }
                    <div className="p-4 text-center">
                        <Button type="submit" disabled={loading} className={`bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl !text-center transition-colors inline-block duration-150 w-full`}>
                            {type === 'login' ? 'Sign In' : 'Create an Account'}
                        </Button>
                    </div>
               </form>
               
            </Modal>
    )
}