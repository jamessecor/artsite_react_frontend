import React from 'react';
import { Form } from 'react-bootstrap';

const StoreItem = ({title, itemNumber, imageSrc}) => (
    <React.Fragment>
        {/* <img className={'w-100'} src={`${config.host}${imageSrc}`} alt={title} /> */}
        <Form target='paypal' action="https://www.paypal.com/cgi-bin/webscr" method='post'>
            <input type="hidden" name="cmd" value="_cart" />
            <input type="hidden" name="business" value="james.secor@gmail.com" />
            <input type="hidden" name="lc" value="US" />
            <input type="hidden" name="item_name" value={`Postcards - ${title}`} />
            <input type="hidden" name="item_number" value={itemNumber} />
            <input type="hidden" name="button_subtype" value="products" />
            <input type="hidden" name="no_note" value="0" />
            <input type="hidden" name="tax_rate" value="6.000" />
            <input type="hidden" name="shipping" value="0.00" />
            <input type="hidden" name="add" value="1" />
            <input type="hidden" name="bn" value="PP-ShopCartBF:btn_cart_LG.gif:NonHostedGuest" />
            <table>
                <tbody>
                    <tr><td>{title}</td></tr>
                    <tr><td>
                        <input type="hidden" name="on0" value="Postcards" />4.5 x 5.5 inch postcards</td></tr><tr><td>
                        <select name="os0">
                            <option value="5 cards">5 cards $20.00 USD</option>
                            <option value="10 cards">10 cards $35.00 USD</option>
                            <option value="15 cards">15 cards $45.00 USD</option>    
                        </select> 
                    </td></tr>
                    <tr><td>
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"></input>
                        <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></img>
                    </td></tr>
                </tbody>
            </table>
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="option_select0" value="5 cards" />
            <input type="hidden" name="option_amount0" value="20.00" />
            <input type="hidden" name="option_select1" value="10 cards" />
            <input type="hidden" name="option_amount1" value="35.00" />
            <input type="hidden" name="option_select2" value="15 cards" />
            <input type="hidden" name="option_amount2" value="45.00" />
            <input type="hidden" name="option_index" value="0"></input>
        </Form>
    </React.Fragment>
);

export default StoreItem;