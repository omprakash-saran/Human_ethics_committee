import Social from '../social/Social';
import styles from './ProfileCard.module.css';

import { MdWork, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const ProfileCard = ({
  index = -1,
  person = {
    name: "Prof. Manish Kumar Asthana",
    position: "Member Secretary",
    jobPost: "Deptt. of HSS",
    phone: "x",
    email: "x",
    address: "x",
    office: "x"
  },
  large = false
}) => {
  const isTop = person.position.toLowerCase().includes("chair") || person.position.toLowerCase().includes("secretary");

  return (
    <div className={`${styles.container} ${isTop ? styles.topMember : ''}`}>
      <div className={`${styles.card} ${large ? styles.largeCard : ''}`}>
        <div className={styles.inner}>

          <div className={styles.front}>
            <div className={styles.imgContainer}>
              <img
                src={`/committee/${index + 1}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = person.gender === 'female' ? "/committee/female-avatar.png"  : "/committee/male-avatar.png";
                }}
                alt="profile"
                className={styles.img}
              />
              <div className={styles.info}>
                <div className='font-extrabold'>{person.name}</div>
                <div>{person.position}</div>
              </div>
            </div>
          </div>

          <div className={styles.back}>
            <div className={`${styles.detailsContainer} flex items-center justify-center`}>
              <div className={`${styles.content} flex-col gap-2 scale-[0.88] justify-center text-sm`}>
                  {person.jobPost && person.jobPost !== 'x' && (
                    <div className="flex items-center gap-2">
                      <MdWork className={`${styles.reactIcon} flex-shrink-0`} />
                      <span>{person.jobPost}</span>
                    </div>
                  )}
                  {person.email && person.email !== 'x' && (
                    <div className="flex items-center gap-2">
                      <MdEmail className={`${styles.reactIcon} flex-shrink-0`} />
                      <span>{person.email}</span>
                    </div>
                  )}
                  {person.phone && person.phone !== 'x' && (
                    <div className="flex items-center gap-2">
                      <MdPhone className={`${styles.reactIcon} flex-shrink-0`} />
                      <span>{person.phone}</span>
                    </div>
                  )}
                  {person.address && person.address !== 'x' && (
                    <div className="flex items-center gap-2">
                      <MdLocationOn className={`${styles.reactIcon} flex-shrink-0`} />
                      <span>{person.address}</span>
                    </div>
                  )}
                <Social socials={person.socials}/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileCard;