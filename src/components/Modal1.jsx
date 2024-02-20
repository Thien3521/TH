export const DemoModal = (props) => {
    const { title, onClose, children } = props;

    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <div className="flex justify-between items-center">
                    <p>{title}</p>
                    <span onClick={onClose} className="close">&times;</span>
                </div>
                <div>{children}</div>
            </div>
        </div>
    )
}