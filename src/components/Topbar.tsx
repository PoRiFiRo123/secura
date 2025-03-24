import { FiPhone, FiMessageCircle, FiBell } from "react-icons/fi";
import styles from '@/styles/Home.module.css'; // Make sure this is imported

export default function Topbar() {
  return (
    <nav className={styles.topbar}>
      {/* Left-side content (optional, like logo/title) */}
      <div></div>

      {/* Right-side icons */}
      <div className={styles.topbarIcons}>
        <FiPhone className="hover:text-indigo-600 cursor-pointer text-xl text-gray-600" />
        <FiMessageCircle className="hover:text-indigo-600 cursor-pointer text-xl text-gray-600" />
        <FiBell className="hover:text-indigo-600 cursor-pointer text-xl text-gray-600" />
        
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          <img
            src="/images/profile.png"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}
