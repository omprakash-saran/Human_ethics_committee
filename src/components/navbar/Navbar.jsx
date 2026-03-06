import styles from './Navbar.module.css';
import ThemeButton from '../themeToggleButton/ThemeToggleButton';
import { useTheme } from '../../context/ThemeProvider';
import { useEffect, useState } from 'react';
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from 'react-router-dom';
import { HashLink} from 'react-router-hash-link';
import { MdFileDownload } from "react-icons/md";

const DocumentItem = ({ fileName, fileUrl }) => {
    return (
      <div className="flex items-center justify-between p-4 mb-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className=" h-8"
        >
          {fileName}
        </a>
  
        <a
          href={fileUrl}
          download
          className="px-4 py-2 hover:scale-2"
        >
            <MdFileDownload />
        </a>
      </div>
    );
  };

const Navbar = () => {
    const { darkMode } = useTheme();
    const [flag, setFlag] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const [isSmallDisplay, setIsSmallDisplay] = useState(false);

    const documents = [
        {
          fileName: "Cover Letter Template",
          fileUrl: "/templates/Cover_Letter_Template.docx",
        },
        {
          fileName: "Demographics Form Template",
          fileUrl: "/templates/Demographics_Form_Template.docx",
        },
        {
          fileName: "IHEC Ethics From Template",
          fileUrl: "/templates/IHEC_Ethics_Form_Template.docx",
        },
        {
          fileName: "Informed Consent From Template",
          fileUrl: "/templates/Informed_Consent_Form_Template.docx",
        },
        {
          fileName: "Positive and Negative Affect Schedule Questionnaire",
          fileUrl: "/templates/Positive and Negative Affect Schedule_Questionnaire.docx",
        },
        {
          fileName: "STAI Questionnaire",
          fileUrl: "/templates/STAI_Questionnaire.docx",
        },
      ];

    useEffect(() => {
        const debounce = (func, delay) => {
            let timeout;
            return () => {
                clearTimeout(timeout);
                timeout = setTimeout(func, delay);
            };
        };
    
        const checkWidth = () => setIsSmallDisplay(window.innerWidth <= 830);
        const debouncedCheck = debounce(checkWidth, 200);
    
        checkWidth();
        window.addEventListener('resize', debouncedCheck);
        return () => window.removeEventListener('resize', debouncedCheck);
    }, []);

    return (
        <div className={styles.container}>
            <nav className={`${styles.nav1} ${isSmallDisplay ? styles.smallHeight : ''}`}>
                <a href="/" className={styles.iitrlogopng}>
                    {darkMode ? (
                        <img src="/images/iitrlogopngdark.png" alt="Indian Institute of Technology Roorkee" className={styles.iitrlogo} draggable="false" />
                    ) : (
                        <img src="/images/iitrLogoPng.png" alt="Indian Institute of Technology Roorkee" className={styles.iitrlogo} draggable="false" />
                    )}
                </a>
                <ul className={styles.navigationButton}>
                    <ThemeButton />
                    {isSmallDisplay && (
                        <div className={styles.hamburgermenu}>
                            {!isOpen ? (
                                <RxHamburgerMenu onClick={() => setIsOpen(true)} />
                            ) : (
                                <RxCross2 onClick={() => setIsOpen(false)} />
                            )}
                        </div>
                    )}
                </ul>
            </nav>

            {!isSmallDisplay && (
                <nav className={styles.nav2}>
                    <ul className={styles.seminav}>
                        <li onMouseEnter={() => setFlag(0)}><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/about'>About</NavLink></li>
                        <li onMouseEnter={() => setFlag(1)}><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/events'>Events</NavLink></li>
                        <li onMouseEnter={() => setFlag(2)}><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/committee'>Committee</NavLink></li>
                        <li onMouseEnter={() => setFlag(3)}><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/human-ethics'>Human ethics</NavLink></li>
                        <li onMouseEnter={() => setFlag(4)}><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/applications'>Applications</NavLink></li>
                        <li onMouseEnter={() => setFlag(5)}><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/downloads'>Downloads</NavLink></li>
                        <li onMouseEnter={() => setFlag(6)}><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/resources'>Resources</NavLink></li>
                    </ul>

                    {flag === 1 && (
                        <div className={styles.seminav_dropdown} onMouseLeave={() => setFlag(null)}>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Ethics Committee Meetings</h4>
                                    <div className={styles.list}>
                                        <li>Upcoming Meeting</li>
                                        <li>Past Meetings</li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Workshops</h4>
                                    <div className={styles.list}>
                                        <li>Faculty Workshops</li>
                                        <li>Student Workshops</li>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {flag === 2 && (
                        <div className={styles.seminav_dropdown} onMouseLeave={() => setFlag(null)}>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Current Committee Members</h4>
                                    <p className='text-[14px] text-[#aeaeae]'>1 Mar 2025 - 28 Feb 2027</p>
                                    <div className={styles.list}>
                                        {/* <li><a href="/docs/CurrentCommitteeMembers.pdf" target="_blank" rel="noopener noreferrer">Authority Letter</a></li> */}
                                        <li><HashLink smooth to="/committee#authorityLetter">Authority Letter</HashLink></li>
                                        <li><HashLink smooth to="/committee#members">Members</HashLink></li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Past Committee Members</h4>
                                    <p className='text-[14px] text-[#aeaeae]'>1 Mar 2021 - 1 Mar 2023</p>
                                    <div className={styles.list}>
                                        {/* <li><HashLink smooth to="/committee#authorityLetter"><a href="/docs/PastCommitteeMembers.pdf" target="_blank" rel="noopener noreferrer">Authority Letter</a></HashLink></li> */}
                                        <li><HashLink smooth to="/committee#authorityLetter">Authority Letter</HashLink></li>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {flag === 3 && (
                        <div className={styles.seminav_dropdown} onMouseLeave={() => setFlag(null)}>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Clinical Trials</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Research Integrity</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Research Risks</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Research Data Management</h4>
                                    <div className={styles.list}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {flag === 4 && (
                        <div className={styles.seminav_dropdown} onMouseLeave={() => setFlag(null)}>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Approved Projects</h4>
                                    <div className={styles.list}>
                                        <li>Meeting 21 Mar 2025</li>
                                        <li>Meeting 10 Jan 2025</li>
                                        <li>Meeting 16 Dec 2024</li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Pending Approvals</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Rejected Projects</h4>
                                    <div className={styles.list}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {flag === 5 && (
                        <div className={styles.seminav_dropdown} onMouseLeave={() => setFlag(null)}>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Templates</h4>
                                    <div className={styles.list}>
                                        {documents.map((doc, idx) => (
                                            <DocumentItem key={idx} fileName={doc.fileName} fileUrl={doc.fileUrl} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {flag === 6 && (
                        <div className={styles.seminav_dropdown} onMouseLeave={() => setFlag(null)}>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Bio Safety</h4>
                                    <div className={styles.list}>
                                        <li>Animal Safety Ethics Committee</li>
                                        <li>Glacier Safety</li>
                                        <li>Gene Academics</li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Internal Resources</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>External Resources</h4>
                                    <div className={styles.list}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            )}

            {isSmallDisplay && isOpen && (
                <nav className={styles.nav3}>
                    <ul className={styles.seminav2}>

                        <details className={styles.dropdown}>
                            <summary><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/about'>About</NavLink></summary>
                        </details>

                        <details className={styles.dropdown}>
                            <summary><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/events'>Events</NavLink></summary>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Ethics Committee Meetings</h4>
                                    <div className={styles.list}>
                                        <li>Upcoming Meeting</li>
                                        <li>Past Meetings</li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Workshops</h4>
                                    <div className={styles.list}>
                                        <li>Faculty Workshops</li>
                                        <li>Student Workshops</li>
                                    </div>
                                </div>
                            </div>
                        </details>

                        <details className={styles.dropdown}>
                            <summary><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/committee'>Committee</NavLink></summary>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Current Committee Members</h4>
                                    <div className={styles.list}>
                                        {/* <li><a href="/docs/CurrentCommitteeMembers.pdf" target="_blank" rel="noopener noreferrer" style={{color: "#e1e1e1"}}>Authority Letter</a></li> */}
                                        <li><HashLink smooth to="/committee#authorityLetter">Authority Letter</HashLink></li>
                                        <li><HashLink smooth to="/committee#members">Members</HashLink></li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Past Committee Members</h4>
                                    <div className={styles.list}>
                                        {/* <li><a href="/docs/PastCommitteeMembers.pdf" target="_blank" rel="noopener noreferrer" style={{color: "#e1e1e1"}}>Authority Letter</a></li> */}
                                        <li><HashLink smooth to="/committee#authorityLetter">Authority Letter</HashLink></li>
                                    </div>
                                </div>
                            </div>
                        </details>

                        <details className={styles.dropdown}>
                            <summary><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/human-ethics'>Human Ethics</NavLink></summary>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Clinical Trials</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Research Integrity</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Research Risks</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Research Data Management</h4>
                                    <div className={styles.list}></div>
                                </div>
                            </div>
                        </details>

                        <details className={styles.dropdown}>
                            <summary><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/applications'>Applications</NavLink></summary>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Approved Projects</h4>
                                    <div className={styles.list}>
                                        <li>Meething 21 Mar 2025</li>
                                        <li>Meething 10 Jan 2025</li>
                                        <li>Meething 16 Dec 2024</li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Pending Approvals</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Rejected Projects</h4>
                                    <div className={styles.list}></div>
                                </div>
                            </div>
                        </details>

                        <details className={styles.dropdown}>
                            <summary><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/downloads'>Downloads</NavLink></summary>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Templates</h4>
                                    <div className={styles.list}>
                                    {documents.map((doc, idx) => (
                                        <DocumentItem key={idx} fileName={doc.fileName} fileUrl={doc.fileUrl} />
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </details>

                        <details className={styles.dropdown}>
                            <summary><NavLink className={({ isActive }) =>`${styles.navItem} ${isActive ? styles.active : ''}`} to='/resources'>Resources</NavLink></summary>
                            <div className={styles.content}>
                                <div className={styles.box}>
                                    <h4>Bio Safety</h4>
                                    <div className={styles.list}>
                                        <li>Animal Safety Ethics Committee</li>
                                        <li>Glacier Safety</li>
                                        <li>Gene Academics</li>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <h4>Internal Resources</h4>
                                    <div className={styles.list}></div>
                                </div>
                                <div className={styles.box}>
                                    <h4>External Resources</h4>
                                    <div className={styles.list}></div>
                                </div>
                            </div>
                        </details>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default Navbar;