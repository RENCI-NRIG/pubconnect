import { Link } from '@reach/router';
import PubConnectLarge from '../img/PC-large.png';

export const NotFound = () => {
    return (
        <div className="not_found_container">
            <Link to="/"><img className="logo-small" src={PubConnectLarge}></img></Link>
            <div><b>404 Error</b>. We can't find the page you are looking for.</div>
        </div>
    )
}