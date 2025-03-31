
import { useDispatch, useSelector } from 'react-redux';
import InputOnly from 'Components/Input/inputOnly';
import { clearSearch, updateSearchValue, updateSearchClickedTrue, updateToast } from 'Views/Common/Slice/Common_slice';
import Icons from 'Utils/Icons';

export function SearchComponent({ className, placeholder }) {
    const dispatch = useDispatch();
    const { search_value, search_clicked } = useSelector(state => state.commonState);

    function handleSearchClicked() {
        if (search_value) {
            dispatch(updateSearchClickedTrue())
        } else {
            dispatch(updateToast({ type: "error", message: "search field should not be empty" }))
        }
    }

    function handleSearchEnter(event) {
        if (event.code === "Enter") {
            if (search_value) {
                dispatch(updateSearchClickedTrue())
            } else {
                dispatch(updateToast({ type: "error", message: "search field should not be empty" }))
            }
        }
    }

    return (
        <div className="position-relative col-xxl-3">
            <InputOnly
                type="text"
                className={className}
                placeholder={placeholder}
                change={(e) => dispatch(updateSearchValue(e.target.value))}
                keyDown={handleSearchEnter}
                value={search_value}
            />

            <span className="input-group-start-icon">{Icons.searchIcon}</span>
            {search_value ? <span className="input-group-end-icon-two cursor-pointer" onClick={handleSearchClicked}>{Icons.searchIcon}</span> : null}
            <span className={`${!search_clicked ? "pe-none" : 'cursor-pointer'} input-group-end-icon-one`} onClick={() => dispatch(clearSearch())}>{Icons.searchCancelIcon}</span>
        </div>
    );

}