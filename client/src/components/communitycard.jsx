import '../styling/communitycard.css';

function CommunityCard(){
    return (
        <article className="comm-card flex">
            {/* img wrapper */}
            <div className="comm-thumbnail">
                <img  src="https://images.unsplash.com/photo-1735943236354-07515c80ebbd?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </div>

            {/* description */}
            <div className="comm-desc">
                {/* header */}
                <div className="comm-header flex">
                    <h2># dj comm.</h2>
                    <p>edm</p>
                </div>

                <div>
                    {/* user thumbnails */}
                    <div className="comm-join flex">
                        <div className="comm-pfps flex">
                            <img src="https://images.unsplash.com/photo-1650765814753-d7b2140bffa1?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                            <img src="https://images.unsplash.com/photo-1758267928314-751925a9170f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                            <img src="https://images.unsplash.com/photo-1614331647673-4b007fc263d5?q=80&w=1266&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                            <div>
                                <p>5K+</p>
                                <p>others</p>
                            </div>
                        </div>
                        <button>join</button>
                    </div>
                    <p className="comm-summary">
                        A community for electronic music DJs, producers, and enthusiasts. Share mixes, production tips, gear setups, and performance clips. Discuss everything from club sets to bedroom mixing, from underground house to mainstage festival EDM. Whether you’re a touring artist, a local resident DJ, or 
                        just learning to beatmatch, this is the place to trade knowledge, 
                        get feedback, and connect with others who live for the drop.
                    </p>
                </div>


            </div>
        </article>
    );
}

export default CommunityCard