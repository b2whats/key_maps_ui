import { createElement } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Error.pcss';
import CenterAbsolute from '../CenterAbsolute';
import Container from '../Container';


const StateError = ({ error }) => (
  <CenterAbsolute>
    <Container>
      <section styleName="Error">

        <div styleName="icon">
          <img className="icon icons8-Headstone" src="data:image/png;base64,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" width="50" height="50" />
        </div>

        <p dangerouslySetInnerHTML={error} />

        <p styleName="subtle-text">
          <small>
            Go back or <a href="/">retry</a>
          </small>
        </p>

      </section>
    </Container>
  </CenterAbsolute>
);


export default CSSModules(StateError, styles);
