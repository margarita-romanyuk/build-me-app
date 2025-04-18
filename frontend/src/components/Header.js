import "bootstrap/dist/css/bootstrap.min.css";

function Header(props) {
    return (
        <div className="container-fluid p-0 fixed-height background-color: silver">
            <div className="col-lg-12 d-flex justify-content-center align-items-center p-0 fixed-height shadowed">

                
                {props.videoSrc ? (
                    <video autoPlay muted loop className="w-100" style={{ height: '600px', objectFit: 'cover' }} >
                        <source src={props.videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img className="img-fluid w-100" src={props.image} alt="Companies dictionary" />
                )}

                <div className="header-caption d-none d-md-block">
                    <h2>{props.header}</h2>
                    <p>{props.subheader}</p>
                </div>
            </div>
        </div>
    );
}

export default Header;
