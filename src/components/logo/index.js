import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// material-ui
import { ButtonBase } from "@mui/material";

// project import
import { APP_DEFAULT_PATH } from "config";
import LogoHeliforte from "../../assets/images/LogoHeliforte.svg";
import logoPequeno from "../../assets/images/logoPequeno.png";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ reverse, isIcon, sx, to }) => (
	<ButtonBase disableRipple component={Link} to={!to ? APP_DEFAULT_PATH : to} sx={{ width: "100%", mr: isIcon ? 0 : 3 }}>
		{isIcon ? <img src={logoPequeno} alt="Logo" width="25" height="25" /> : <img src={LogoHeliforte} alt="Logo" width="150" height="40" />}
	</ButtonBase>
);

LogoSection.propTypes = {
	reverse: PropTypes.bool,
	isIcon: PropTypes.bool,
	sx: PropTypes.object,
	to: PropTypes.string,
};

export default LogoSection;
