import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import profileImage from "@/assets/a college boy.png"

// No more lucide-react imports needed
import SettingsHeader from "./settings-header"
import ProfileSection from "./profile-section"
import SettingsMenuItem from "./settings-menu-item"
import ConfirmationModal from "./confirmation-modal"
import LogoutModal from "./logout-modal"
import { getCurrentUserProfile, deleteUserAccount } from "@/lib/api"
import { getAuthToken, removeAuthToken } from "@/lib/utils"

// Custom Event Bookings Icon
const EventBookingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" className={className}>
    <rect width="45" height="45" rx="8" fill="#333333"/>
    <path d="M16.5938 12C16.7678 12 16.9347 12.0691 17.0578 12.1922C17.1809 12.3153 17.25 12.4822 17.25 12.6562V13.3125H27.75V12.6562C27.75 12.4822 27.8191 12.3153 27.9422 12.1922C28.0653 12.0691 28.2322 12 28.4062 12C28.5803 12 28.7472 12.0691 28.8703 12.1922C28.9934 12.3153 29.0625 12.4822 29.0625 12.6562V13.3125H30.375C31.0712 13.3125 31.7389 13.5891 32.2312 14.0813C32.7234 14.5736 33 15.2413 33 15.9375V30.375C33 31.0712 32.7234 31.7389 32.2312 32.2312C31.7389 32.7234 31.0712 33 30.375 33H14.625C13.9288 33 13.2611 32.7234 12.7688 32.2312C12.2766 31.7389 12 31.0712 12 30.375V15.9375C12 15.2413 12.2766 14.5736 12.7688 14.0813C13.2611 13.5891 13.9288 13.3125 14.625 13.3125H15.9375V12.6562C15.9375 12.4822 16.0066 12.3153 16.1297 12.1922C16.2528 12.0691 16.4197 12 16.5938 12ZM14.625 14.625C14.2769 14.625 13.9431 14.7633 13.6969 15.0094C13.4508 15.2556 13.3125 15.5894 13.3125 15.9375V30.375C13.3125 30.7231 13.4508 31.0569 13.6969 31.3031C13.9431 31.5492 14.2769 31.6875 14.625 31.6875H30.375C30.7231 31.6875 31.0569 31.5492 31.3031 31.3031C31.5492 31.0569 31.6875 30.7231 31.6875 30.375V15.9375C31.6875 15.5894 31.5492 15.2556 31.3031 15.0094C31.0569 14.7633 30.7231 14.625 30.375 14.625H14.625Z" fill="white"/>
    <path d="M15.9375 17.5781C15.9375 17.4911 16.0004 17.4076 16.1122 17.3461C16.2241 17.2846 16.3759 17.25 16.5341 17.25H28.4659C28.6241 17.25 28.7759 17.2846 28.8878 17.3461C28.9996 17.4076 29.0625 17.4911 29.0625 17.5781V18.2344C29.0625 18.3214 28.9996 18.4049 28.8878 18.4664C28.7759 18.5279 28.6241 18.5625 28.4659 18.5625H16.5341C16.3759 18.5625 16.2241 18.5279 16.1122 18.4664C16.0004 18.4049 15.9375 18.3214 15.9375 18.2344V17.5781Z" fill="white"/>
  </svg>
)

// Custom Notifications Icon
const NotificationsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" className={className}>
    <rect width="45" height="45" rx="8" fill="#333333"/>
    <path d="M12.0315 25.4085C11.8079 26.8722 12.8064 27.8876 14.0286 28.3937C18.7148 30.3362 25.2353 30.3362 29.9214 28.3937C31.1436 27.8876 32.1422 26.8712 31.9185 25.4085C31.782 24.5087 31.1027 23.76 30.5997 23.0282C29.9414 22.058 29.8763 21.0006 29.8752 19.875C29.8763 15.5259 26.3399 12 21.975 12C17.6102 12 14.0738 15.5259 14.0738 19.875C14.0738 21.0006 14.0087 22.059 13.3493 23.0282C12.8474 23.76 12.1691 24.5087 12.0315 25.4085Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.7754 29.8501C18.2563 31.6614 19.9552 33.0001 21.9754 33.0001C23.9966 33.0001 25.6934 31.6614 26.1754 29.8501" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

// Custom Blocked Users Icon
const BlockedUsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" className={className}>
    <rect width="45" height="45" rx="8" fill="#333333"/>
    <path d="M22.5 33C21.0475 33 19.6825 32.7242 18.405 32.1726C17.1275 31.621 16.0163 30.873 15.0713 29.9287C14.1263 28.9844 13.3783 27.8732 12.8274 26.595C12.2765 25.3168 12.0007 23.9518 12 22.5C11.9993 21.0482 12.2751 19.6832 12.8274 18.405C13.3797 17.1268 14.1277 16.0155 15.0713 15.0712C16.0149 14.1269 17.1261 13.379 18.405 12.8274C19.6839 12.2758 21.0489 12 22.5 12C23.9511 12 25.3161 12.2758 26.595 12.8274C27.8739 13.379 28.9851 14.1269 29.9287 15.0712C30.8724 16.0155 31.6206 17.1268 32.1736 18.405C32.7266 19.6832 33.0021 21.0482 33 22.5C32.9979 23.9518 32.7221 25.3168 32.1726 26.595C31.6231 27.8732 30.8752 28.9844 29.9287 29.9287C28.9823 30.873 27.8711 31.6213 26.595 32.1736C25.3189 32.7259 23.9539 33.0014 22.5 33ZM22.5 30.9C23.445 30.9 24.355 30.747 25.23 30.4411C26.105 30.1352 26.91 29.6932 27.645 29.115L15.885 17.355C15.3075 18.09 14.8655 18.895 14.5589 19.77C14.2523 20.645 14.0993 21.555 14.1 22.5C14.1 24.845 14.9138 26.8312 16.5413 28.4587C18.1688 30.0862 20.155 30.9 22.5 30.9ZM29.115 27.645C29.6925 26.91 30.1345 26.105 30.4411 25.23C30.7477 24.355 30.9007 23.445 30.9 22.5C30.9 20.155 30.0862 18.1687 28.4587 16.5412C26.8312 14.9137 24.845 14.1 22.5 14.1C21.555 14.1 20.645 14.2529 19.77 14.5588C18.895 14.8647 18.09 15.3068 17.355 15.885L29.115 27.645Z" fill="white"/>
  </svg>
)

// Custom Help & Support Icon
const HelpSupportIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" className={className}>
    <rect width="45" height="45" rx="8" fill="#333333"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M33.6212 19.5832C34.2417 21.4568 34.2239 23.4799 34.1807 25.2206L34.1785 25.3247C34.1712 25.6186 34.0474 25.8975 33.8344 26.1001C33.6214 26.3027 33.3367 26.4124 33.0428 26.405C32.749 26.3977 32.4701 26.2739 32.2675 26.0609C32.0649 25.8479 31.9552 25.5632 31.9625 25.2693L31.9659 25.1663C32.0091 23.3968 32.0002 21.7404 31.5171 20.2801C31.1514 19.1793 30.5732 18.161 29.8153 17.283C28.2759 15.5087 26.0971 14.4154 23.7545 14.2419C21.4118 14.0683 19.0957 14.8286 17.3117 16.3567C16.4305 17.1109 15.7072 18.0319 15.1833 19.0667C14.6595 20.1015 14.3454 21.2297 14.2592 22.3864C14.2016 23.1531 14.2149 23.6051 14.2348 24.2456C14.247 24.6577 14.2625 25.1486 14.2625 25.851C14.2625 26.1449 14.1458 26.4267 13.938 26.6345C13.7302 26.8423 13.4484 26.959 13.1545 26.959C12.8607 26.959 12.5788 26.8423 12.3711 26.6345C12.1633 26.4267 12.0465 26.1449 12.0465 25.851C12.0465 25.307 12.0343 24.8605 12.0222 24.4494C12.0022 23.7093 11.9845 23.0877 12.0499 22.2224C12.1578 20.7752 12.5506 19.3635 13.2059 18.0686C13.8611 16.7737 14.7658 15.6211 15.868 14.677C18.0952 12.7628 20.9912 11.8112 23.9197 12.0311C26.8468 12.249 29.5689 13.616 31.4917 15.8337C32.4402 16.932 33.1637 18.206 33.6212 19.5832Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M19.8361 26.0713L20.1397 29.5393C20.1761 29.9535 20.1305 30.3708 20.0055 30.7674C19.8806 31.1639 19.6788 31.532 19.4116 31.8506C19.1444 32.1691 18.817 32.4319 18.4482 32.6239C18.0795 32.8159 17.6765 32.9334 17.2623 32.9697C16.0495 33.0757 14.8444 32.6956 13.9118 31.9131C12.9793 31.1306 12.3958 30.0097 12.2896 28.797L12.0126 25.6437C11.9746 25.2087 12.0226 24.7706 12.1539 24.3542C12.2853 23.9379 12.4973 23.5515 12.778 23.2171C13.0587 22.8827 13.4025 22.6069 13.7898 22.4054C14.1771 22.2039 14.6003 22.0806 15.0352 22.0427C16.2061 21.9404 17.3696 22.3073 18.2699 23.0628C19.1703 23.8183 19.7336 24.9005 19.8361 26.0713ZM15.228 24.2498C14.9353 24.2754 14.6648 24.4162 14.476 24.6413C14.2871 24.8663 14.1953 25.1571 14.2208 25.4498L14.4978 28.6042C14.5528 29.2312 14.8544 29.8107 15.3364 30.2154C15.8184 30.6201 16.4413 30.8169 17.0684 30.7626C17.1927 30.7518 17.3138 30.7167 17.4245 30.6591C17.5353 30.6015 17.6336 30.5227 17.7139 30.4271C17.7942 30.3315 17.8548 30.221 17.8923 30.1019C17.9299 29.9829 17.9435 29.8576 17.9326 29.7332L17.629 26.2652C17.6038 25.9752 17.5216 25.693 17.3873 25.4348C17.253 25.1765 17.0691 24.9472 16.8461 24.7601C16.6231 24.5729 16.3654 24.4315 16.0878 24.344C15.8102 24.2564 15.518 24.2244 15.228 24.2498ZM33.9075 28.9543L34.2111 25.4863C34.2475 25.0721 34.2019 24.6549 34.0769 24.2583C33.952 23.8617 33.7502 23.4937 33.483 23.1751C33.2158 22.8566 32.8884 22.5938 32.5196 22.4018C32.1509 22.2097 31.7479 22.0923 31.3337 22.056C30.1209 21.95 28.9158 22.3301 27.9832 23.1126C27.0507 23.8951 26.4672 25.016 26.361 26.2287L26.084 29.382C26.046 29.8169 26.094 30.2551 26.2253 30.6714C26.3567 31.0878 26.5687 31.4742 26.8494 31.8086C27.1301 32.143 27.4739 32.4188 27.8612 32.6203C28.2485 32.8218 28.6717 32.945 29.1066 32.983C30.2775 33.0853 31.441 32.7183 32.3413 31.9628C33.2417 31.2073 33.805 30.1252 33.9075 28.9543ZM29.2994 30.7758C29.0067 30.7502 28.7362 30.6094 28.5474 30.3844C28.3585 30.1594 28.2667 29.8686 28.2922 29.5759L28.5692 26.4215C28.6242 25.7945 28.9258 25.215 29.4078 24.8102C29.8898 24.4055 30.5127 24.2087 31.1398 24.2631C31.3906 24.2857 31.6223 24.4066 31.7843 24.5995C31.9462 24.7923 32.0252 25.0415 32.004 25.2924L31.7004 28.7604C31.6752 29.0504 31.593 29.3326 31.4587 29.5909C31.3244 29.8492 31.1404 30.0784 30.9175 30.2656C30.6945 30.4528 30.4368 30.5942 30.1592 30.6817C29.8816 30.7693 29.5894 30.8013 29.2994 30.7758Z" fill="white"/>
  </svg>
)

// Custom Privacy Policy Icon
const PrivacyPolicyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" className={className}>
    <rect width="45" height="45" rx="8" fill="#333333"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M21.4918 12H23.5547C25.35 12 26.7721 12 27.8846 12.1494C29.0293 12.3038 29.9563 12.628 30.6879 13.3587C31.4185 14.0902 31.7427 15.0172 31.8971 16.1619C32.0465 17.2754 32.0465 18.6966 32.0465 20.4918V24.5082C32.0465 26.3034 32.0465 27.7256 31.8971 28.8381C31.7427 29.9828 31.4185 30.9098 30.6879 31.6413C29.9563 32.372 29.0293 32.6962 27.8846 32.8506C26.7711 33 25.35 33 23.5547 33H21.4918C19.6966 33 18.2744 33 17.1619 32.8506C16.0172 32.6962 15.0902 32.372 14.3587 31.6413C13.628 30.9098 13.3038 29.9828 13.1494 28.8381C13 27.7246 13 26.3034 13 24.5082V20.4918C13 18.6966 13 17.2744 13.1494 16.1619C13.3038 15.0172 13.628 14.0902 14.3587 13.3587C15.0902 12.628 16.0172 12.3038 17.1619 12.1494C18.2754 12 19.6966 12 21.4918 12ZM17.3563 13.6019C16.3737 13.7337 15.8072 13.9818 15.393 14.395C14.9808 14.8081 14.7327 15.3747 14.6009 16.3573C14.4661 17.3613 14.4641 18.6839 14.4641 20.5465V24.4535C14.4641 26.3161 14.4661 27.6396 14.6009 28.6437C14.7327 29.6253 14.9808 30.1919 15.394 30.605C15.8072 31.0182 16.3737 31.2663 17.3563 31.3981C18.3604 31.5329 19.6829 31.5349 21.5455 31.5349H23.499C25.3617 31.5349 26.6852 31.5329 27.6893 31.3981C28.6709 31.2663 29.2374 31.0182 29.6506 30.605C30.0637 30.1919 30.3118 29.6253 30.4437 28.6427C30.5785 27.6396 30.5804 26.3161 30.5804 24.4535V20.5465C30.5804 18.6839 30.5785 17.3613 30.4437 16.3563C30.3118 15.3747 30.0637 14.8081 29.6506 14.395C29.2374 13.9818 28.6709 13.7337 27.6883 13.6019C26.6852 13.4671 25.3617 13.4651 23.499 13.4651H21.5455C19.6829 13.4651 18.3613 13.4671 17.3563 13.6019ZM17.8837 20.5465C17.8837 20.3522 17.9609 20.1659 18.0983 20.0285C18.2357 19.8911 18.422 19.814 18.6163 19.814H26.4302C26.6245 19.814 26.8108 19.8911 26.9482 20.0285C27.0856 20.1659 27.1628 20.3522 27.1628 20.5465C27.1628 20.7408 27.0856 20.9271 26.9482 21.0645C26.8108 21.2019 26.6245 21.2791 26.4302 21.2791H18.6163C18.422 21.2791 18.2357 21.2019 18.0983 21.0645C17.9609 20.9271 17.8837 20.7408 17.8837 20.5465ZM17.8837 24.4535C17.8837 24.2592 17.9609 24.0729 18.0983 23.9355C18.2357 23.7981 18.422 23.7209 18.6163 23.7209H23.5C23.6943 23.7209 23.8806 23.7981 24.018 23.9355C24.1554 24.0729 24.2326 24.2592 24.2326 24.4535C24.2326 24.6478 24.1554 24.8341 24.018 24.9715C23.8806 25.1089 23.6943 25.186 23.5 25.186H18.6163C18.422 25.186 18.2357 25.1089 18.0983 24.9715C17.9609 24.8341 17.8837 24.6478 17.8837 24.4535Z" fill="white"/>
  </svg>
)

// Custom Log Out Icon
const LogOutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" className={className}>
    <rect width="45" height="45" rx="8" fill="#333333"/>
    <path d="M15.3333 33C14.6917 33 14.1426 32.7717 13.686 32.3152C13.2294 31.8586 13.0008 31.3091 13 30.6667V14.3333C13 13.6917 13.2287 13.1426 13.686 12.686C14.1433 12.2294 14.6924 12.0008 15.3333 12H22.3333C22.6639 12 22.9412 12.112 23.1652 12.336C23.3892 12.56 23.5008 12.8369 23.5 13.1667C23.4992 13.4964 23.3872 13.7737 23.164 13.9985C22.9408 14.2233 22.6639 14.3349 22.3333 14.3333H15.3333V30.6667H22.3333C22.6639 30.6667 22.9412 30.7787 23.1652 31.0027C23.3892 31.2267 23.5008 31.5035 23.5 31.8333C23.4992 32.1631 23.3872 32.4404 23.164 32.6651C22.9408 32.8899 22.6639 33.0015 22.3333 33H15.3333ZM29.5375 23.6667H21.1667C20.8361 23.6667 20.5592 23.5547 20.336 23.3307C20.1128 23.1067 20.0008 22.8298 20 22.5C19.9992 22.1702 20.1112 21.8933 20.336 21.6693C20.5608 21.4453 20.8377 21.3333 21.1667 21.3333H29.5375L27.35 19.1458C27.1361 18.9319 27.0292 18.6694 27.0292 18.3583C27.0292 18.0472 27.1361 17.775 27.35 17.5417C27.5639 17.3083 27.8361 17.1866 28.1667 17.1765C28.4972 17.1664 28.7792 17.2784 29.0125 17.5125L33.1833 21.6833C33.4166 21.9167 33.5333 22.1889 33.5333 22.5C33.5333 22.8111 33.4166 23.0833 33.1833 23.3167L29.0125 27.4875C28.7792 27.7208 28.5023 27.8328 28.1818 27.8235C27.8614 27.8142 27.5841 27.6924 27.35 27.4583C27.1361 27.225 27.0342 26.9481 27.0443 26.6277C27.0544 26.3072 27.166 26.0397 27.3792 25.825L29.5375 23.6667Z" fill="white"/>
  </svg>
)

// Custom Delete Account Icon
const DeleteAccountIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" className={className}>
    <rect width="45" height="45" rx="8" fill="#333333"/>
    <path d="M14.0011 16.3753C14.0011 15.8923 14.3652 15.4997 14.8148 15.4997H17.6277C18.1861 15.4839 18.679 15.1027 18.869 14.5378L18.9007 14.4381L19.0221 14.0475C19.0959 13.8081 19.1603 13.5991 19.2511 13.4122C19.6079 12.6751 20.2686 12.1638 21.0317 12.0325C21.2259 12 21.4296 12 21.665 12H25.336C25.5714 12 25.7762 12 25.9693 12.0325C26.7325 12.1638 27.3943 12.6751 27.75 13.4122C27.8407 13.5991 27.9051 13.8081 27.979 14.0475L28.1004 14.4381L28.132 14.5378C28.322 15.1027 28.9131 15.485 29.4725 15.4997H32.1852C32.6359 15.4997 33 15.8913 33 16.3753C33 16.8594 32.6359 17.25 32.1862 17.25H14.8138C14.3641 17.25 14.0011 16.8583 14.0011 16.3753ZM23.3496 33H24.1803C27.0375 33 28.4656 33 29.3955 32.0938C30.3243 31.1866 30.4193 29.6998 30.6093 26.7273L30.8837 22.4422C30.9872 20.8284 31.0389 20.022 30.5724 19.5106C30.1058 18.9993 29.3195 18.9993 27.7447 18.9993H19.7852C18.2114 18.9993 17.424 18.9993 16.9575 19.5106C16.491 20.022 16.5437 20.8284 16.6461 22.4422L16.9206 26.7262C17.1105 29.7009 17.2055 31.1866 18.1344 32.0938C19.0632 33.001 20.4924 33 23.3496 33Z" fill="#FF5151"/>
  </svg>
)

interface SettingsScreenProps {
  onNavigateToEventBookings?: () => void
  onNavigateToNotifications?: () => void
  onNavigateToBlockedUsers?: () => void
  onNavigateToHelpSupport?: () => void
  onNavigateToPrivacyPolicy?: () => void
  onBack?: () => void
}

interface UserProfile {
  name: string
  university: string
  profileImage: string
}

export default function SettingsScreen({
  onNavigateToEventBookings,
  onNavigateToNotifications,
  onNavigateToBlockedUsers,
  onNavigateToHelpSupport,
  onNavigateToPrivacyPolicy,
  onBack,
}: SettingsScreenProps) {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Loading...",
    university: "Loading...",
    profileImage: profileImage
  })
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        const response = await getCurrentUserProfile(token)
        if (response.success) {
          const profileData = response.data
          setUserProfile({
            name: profileData.name,
            university: profileData.university?.name || "University not set",
            profileImage: profileData.images?.[0]?.cloudfrontUrl || profileImage
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsProcessing(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No authentication token found')
        return
      }

      // Call delete account API
      const response = await deleteUserAccount(token)
      if (response.success) {
        console.log('Account deleted successfully')
        // Clear auth token
        removeAuthToken()
        // Redirect to onboarding/login
        navigate('/onboarding')
      } else {
        console.error('Failed to delete account:', response.message)
        alert('Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('An error occurred while deleting your account. Please try again.')
    } finally {
      setIsProcessing(false)
      setShowDeleteModal(false)
    }
  }

  const handleConfirmLogout = async () => {
    try {
      setIsProcessing(true)
      // Clear auth token
      removeAuthToken()
      console.log('User logged out successfully')
      // Redirect to onboarding/login
      navigate('/onboarding')
    } catch (error) {
      console.error('Error during logout:', error)
      alert('An error occurred during logout. Please try again.')
    } finally {
      setIsProcessing(false)
      setShowLogoutModal(false)
    }
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  const menuItems = [
    { icon: EventBookingsIcon, title: "Event Bookings", onClick: onNavigateToEventBookings },
    { icon: NotificationsIcon, title: "Notifications", onClick: onNavigateToNotifications },
    { icon: BlockedUsersIcon, title: "Blocked users", onClick: onNavigateToBlockedUsers },
    { icon: HelpSupportIcon, title: "Help & Support", onClick: onNavigateToHelpSupport },
    { icon: PrivacyPolicyIcon, title: "Privacy policy and T&C", onClick: onNavigateToPrivacyPolicy },
    { icon: LogOutIcon, title: "Log Out", onClick: handleLogout },
    { icon: DeleteAccountIcon, title: "Delete account", onClick: handleDeleteAccount, isDestructive: true },
  ]

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      <div className="flex-1">
        <SettingsHeader title="Settings" onBack={onBack} />
        <ProfileSection 
          name={userProfile.name} 
          subtitle={userProfile.university} 
          profileImage={userProfile.profileImage} 
        />
      </div>
      <div className="w-full" style={{ marginTop: '30px' }}>
        {menuItems.map((item, index) => (
          <SettingsMenuItem 
            key={index} 
            icon={item.icon} 
            title={item.title} 
            onClick={item.onClick}
            isDestructive={item.isDestructive}
          />
        ))}
      </div>

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText={isProcessing ? "Deleting..." : "Yes"}
        cancelText="No"
        icon="delete"
        isDestructive={true}
      />

      {/* Log Out Modal - Using dedicated component like working example */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onConfirm={handleConfirmLogout} 
        onCancel={handleCancelLogout}
        isProcessing={isProcessing}
      />
    </div>
  )
}
