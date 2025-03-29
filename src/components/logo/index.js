import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// material-ui
import { ButtonBase } from "@mui/material";

// project import
import LogoMain from "./LogoMain";
import LogoIcon from "./LogoIcon";
import { APP_DEFAULT_PATH } from "config";
import LogoHeliforte from "../../assets/images/LogoHeliforte.svg";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ reverse, isIcon, sx, to }) => (
	<ButtonBase disableRipple component={Link} to={!to ? APP_DEFAULT_PATH : to} sx={{ width: "100%", mr: isIcon ? 0 : 3 }}>
		{isIcon ? <img src={LogoHeliforte} alt="Logo" width="50" height="40" /> : <img src={LogoHeliforte} alt="Logo" width="150" height="40" />}
		{/* {isIcon ? <LogoIcon /> : <LogoMain reverse={reverse} />} */}
	</ButtonBase>
);

LogoSection.propTypes = {
	reverse: PropTypes.bool,
	isIcon: PropTypes.bool,
	sx: PropTypes.object,
	to: PropTypes.string,
};

export default LogoSection;
