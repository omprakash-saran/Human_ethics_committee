import BgImage from '../../components/bgImage/BgImage';
import ProfileCard from '../../components/profileCard/ProfileCard';
import SecondaryTabsLetter from '../../components/secondaryTabs/SecondaryTabsLetter';
import styles from './Committee.module.css';
import { CommitteeData } from './CommitteeData';

const Committee = () => {
  const topMembers = CommitteeData.slice(0, 2);    
  const otherMembers = CommitteeData.slice(2);    

  return (
    <div className={`${styles.container}`}>
      <BgImage text="Committee" />

      <div className={`${styles.title}`}>
        <h2 className={`${styles.heading}`}>Committee Members</h2>
        <div className={`${styles.date} text-center text-[#7d7d7dbd]`}>1 Mar 2025 - 28 Feb 2027</div>
      </div>

      <div className={`${styles.members}`} id='members'>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
          {topMembers.map((person, index) => (
            <ProfileCard key={index} person={person} index={index} large />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 translate-y-10 justify-center items-center ">
          {otherMembers.map((person, index) => (
            <ProfileCard key={index + 2} person={person} index={index + 2} />
          ))}
        </div>

      </div>

      <div className={`${styles.title}`}>
        <h2 className={`${styles.heading}`}>Authority Letters</h2>
        <div id="authorityLetter">
          <SecondaryTabsLetter/>
        </div>
      </div>
    </div>
  );
};

export default Committee;