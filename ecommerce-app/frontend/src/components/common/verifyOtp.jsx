import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendOtp, verifyOtp } from '../../api/auth';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const email = localStorage.getItem('userEmail')

  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus on next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        // Focus on previous input if current input is already empty
        if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
      } else {
        // Clear the current input value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const otpValue = otp.join("");
      const email = localStorage.getItem('userEmail')
      const data = await verifyOtp(email, otpValue);
      localStorage.setItem("token", JSON.stringify(data.token));
      alert('OTP Verified Successfully!');
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-2xl shadow-lg w-[350px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Enter OTP</label>
          <div className="flex justify-between">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-10 h-10 mx-1 mt-3 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? <span className="loader"></span> : 'Verify OTP'}
        </button>

        <p className="text-sm text-center mt-4">
          Didn’t receive the OTP?{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() =>
                resendOtp(email)
            }
          >
            Resend OTP
          </span>
        </p>
      </form>
    </div>
  );
};

export default memo(VerifyOtp);