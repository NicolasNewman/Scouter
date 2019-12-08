import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';

function mapStateToProps(state, ownProps) {
    return {
        dataStore: ownProps.dataStore
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
