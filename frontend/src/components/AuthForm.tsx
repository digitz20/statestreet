import React, { useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  Checkbox, // Added
  FormControlLabel, // Added
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export interface AuthFormProps {
  formType: 'login' | 'register';
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Make it optional with '?'
  formData: any;
  error?: string;
  loading?: boolean;
  captchaValue?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  onSubmit,
  onInputChange,
  onCheckboxChange, // Added
  formData,
  error,
  loading,
  captchaValue, // Add this line
}) => {
  const isRegister = formType === 'register';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(125,211,252,0.2), transparent 32%), linear-gradient(135deg, #030712 0%, #07111f 45%, #13233f 100%)', zIndex: 0 }} />
      <Card sx={{ width: '100%', maxWidth: 540, p: 1, borderRadius: 4, bgcolor: 'rgba(7, 14, 30, 0.82)', color: 'white', boxShadow: '0 30px 90px rgba(0,0,0,0.45)', backdropFilter: 'blur(18px)', position: 'relative', zIndex: 1 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
              <Typography variant="overline" sx={{ color: '#7dd3fc' }}>StateStreet • secure access</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{isRegister ? 'Create your account' : 'Welcome back'}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>{isRegister ? 'Open a premium workspace and connect your profile to the live dashboard flow.' : 'Sign in to continue managing profile updates, deposits, and withdrawals.'}</Typography>
              </Box>
              <IconButton onClick={() => navigate('/')} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.16)' }} aria-label="Back home">
                <Typography sx={{ fontSize: '1rem' }}>↩</Typography>
              </IconButton>
            </Box>
            <Box component="form" onSubmit={onSubmit} noValidate>
              {isRegister && (
                <>
                  <TextField label="Full name" name="fullName" required fullWidth value={formData.fullName || ''} onChange={onInputChange} sx={fieldSx} />
                  <TextField label="Username" name="username" required fullWidth value={formData.username || ''} onChange={onInputChange} sx={fieldSx} />
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel id="account-type-label">Account Type</InputLabel>
                    <Select
                      labelId="account-type-label"
                      id="accountType"
                      name="accountType"
                      value={formData.accountType || ''}
                      label="Account Type"
                      onChange={onInputChange}
                      required
                      sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
                      <MenuItem value="pro">Pro</MenuItem>
                      <MenuItem value="classic">Classic</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                      labelId="country-label"
                      id="country"
                      name="country"
                      value={formData.country || ''}
                      label="Country"
                      onChange={onInputChange}
                      required
                      sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Afghanistan">Afghanistan</MenuItem>
                      <MenuItem value="Åland Islands">Åland Islands</MenuItem>
                      <MenuItem value="Albania">Albania</MenuItem>
                      <MenuItem value="Algeria">Algeria</MenuItem>
                      <MenuItem value="American Samoa">American Samoa</MenuItem>
                      <MenuItem value="Andorra">Andorra</MenuItem>
                      <MenuItem value="Angola">Angola</MenuItem>
                      <MenuItem value="Anguilla">Anguilla</MenuItem>
                      <MenuItem value="Antarctica">Antarctica</MenuItem>
                      <MenuItem value="Antigua and Barbuda">Antigua and Barbuda</MenuItem>
                      <MenuItem value="Argentina">Argentina</MenuItem>
                      <MenuItem value="Armenia">Armenia</MenuItem>
                      <MenuItem value="Aruba">Aruba</MenuItem>
                      <MenuItem value="Australia">Australia</MenuItem>
                      <MenuItem value="Austria">Austria</MenuItem>
                      <MenuItem value="Azerbaijan">Azerbaijan</MenuItem>
                      <MenuItem value="Bahamas">Bahamas</MenuItem>
                      <MenuItem value="Bahrain">Bahrain</MenuItem>
                      <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                      <MenuItem value="Barbados">Barbados</MenuItem>
                      <MenuItem value="Belarus">Belarus</MenuItem>
                      <MenuItem value="Belgium">Belgium</MenuItem>
                      <MenuItem value="Belize">Belize</MenuItem>
                      <MenuItem value="Benin">Benin</MenuItem>
                      <MenuItem value="Bermuda">Bermuda</MenuItem>
                      <MenuItem value="Bhutan">Bhutan</MenuItem>
                      <MenuItem value="Bolivia">Bolivia</MenuItem>
                      <MenuItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</MenuItem>
                      <MenuItem value="Botswana">Botswana</MenuItem>
                      <MenuItem value="Bouvet Island">Bouvet Island</MenuItem>
                      <MenuItem value="Brazil">Brazil</MenuItem>
                      <MenuItem value="British Indian Ocean Territory">British Indian Ocean Territory</MenuItem>
                      <MenuItem value="Brunei Darussalam">Brunei Darussalam</MenuItem>
                      <MenuItem value="Bulgaria">Bulgaria</MenuItem>
                      <MenuItem value="Burkina Faso">Burkina Faso</MenuItem>
                      <MenuItem value="Burundi">Burundi</MenuItem>
                      <MenuItem value="Cambodia">Cambodia</MenuItem>
                      <MenuItem value="Cameroon">Cameroon</MenuItem>
                      <MenuItem value="Canada">Canada</MenuItem>
                      <MenuItem value="Cape Verde">Cape Verde</MenuItem>
                      <MenuItem value="Cayman Islands">Cayman Islands</MenuItem>
                      <MenuItem value="Central African Republic">Central African Republic</MenuItem>
                      <MenuItem value="Chad">Chad</MenuItem>
                      <MenuItem value="Chile">Chile</MenuItem>
                      <MenuItem value="China">China</MenuItem>
                      <MenuItem value="Christmas Island">Christmas Island</MenuItem>
                      <MenuItem value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</MenuItem>
                      <MenuItem value="Colombia">Colombia</MenuItem>
                      <MenuItem value="Comoros">Comoros</MenuItem>
                      <MenuItem value="Congo">Congo</MenuItem>
                      <MenuItem value="Congo, The Democratic Republic Of The">Congo, The Democratic Republic Of The</MenuItem>
                      <MenuItem value="Cook Islands">Cook Islands</MenuItem>
                      <MenuItem value="Costa Rica">Costa Rica</MenuItem>
                      <MenuItem value="Cote D'Ivoire">Cote D'Ivoire</MenuItem>
                      <MenuItem value="Croatia">Croatia</MenuItem>
                      <MenuItem value="Cuba">Cuba</MenuItem>
                      <MenuItem value="Cyprus">Cyprus</MenuItem>
                      <MenuItem value="Czech Republic">Czech Republic</MenuItem>
                      <MenuItem value="Denmark">Denmark</MenuItem>
                      <MenuItem value="Djibouti">Djibouti</MenuItem>
                      <MenuItem value="Dominica">Dominica</MenuItem>
                      <MenuItem value="Dominican Republic">Dominican Republic</MenuItem>
                      <MenuItem value="Ecuador">Ecuador</MenuItem>
                      <MenuItem value="Egypt">Egypt</MenuItem>
                      <MenuItem value="El Salvador">El Salvador</MenuItem>
                      <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
                      <MenuItem value="Eritrea">Eritrea</MenuItem>
                      <MenuItem value="Estonia">Estonia</MenuItem>
                      <MenuItem value="Ethiopia">Ethiopia</MenuItem>
                      <MenuItem value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</MenuItem>
                      <MenuItem value="Faroe Islands">Faroe Islands</MenuItem>
                      <MenuItem value="Fiji">Fiji</MenuItem>
                      <MenuItem value="Finland">Finland</MenuItem>
                      <MenuItem value="France">France</MenuItem>
                      <MenuItem value="French Guiana">French Guiana</MenuItem>
                      <MenuItem value="French Polynesia">French Polynesia</MenuItem>
                      <MenuItem value="French Southern Territories">French Southern Territories</MenuItem>
                      <MenuItem value="Gabon">Gabon</MenuItem>
                      <MenuItem value="Gambia">Gambia</MenuItem>
                      <MenuItem value="Georgia">Georgia</MenuItem>
                      <MenuItem value="Germany">Germany</MenuItem>
                      <MenuItem value="Ghana">Ghana</MenuItem>
                      <MenuItem value="Gibraltar">Gibraltar</MenuItem>
                      <MenuItem value="Greece">Greece</MenuItem>
                      <MenuItem value="Greenland">Greenland</MenuItem>
                      <MenuItem value="Grenada">Grenada</MenuItem>
                      <MenuItem value="Guadeloupe">Guadeloupe</MenuItem>
                      <MenuItem value="Guam">Guam</MenuItem>
                      <MenuItem value="Guatemala">Guatemala</MenuItem>
                      <MenuItem value="Guernsey">Guernsey</MenuItem>
                      <MenuItem value="Guinea">Guinea</MenuItem>
                      <MenuItem value="Guinea-Bissau">Guinea-Bissau</MenuItem>
                      <MenuItem value="Guyana">Guyana</MenuItem>
                      <MenuItem value="Haiti">Haiti</MenuItem>
                      <MenuItem value="Heard Island And Mcdonald Islands">Heard Island And Mcdonald Islands</MenuItem>
                      <MenuItem value="Holy See (Vatican City State)">Holy See (Vatican City State)</MenuItem>
                      <MenuItem value="Honduras">Honduras</MenuItem>
                      <MenuItem value="Hong Kong">Hong Kong</MenuItem>
                      <MenuItem value="Hungary">Hungary</MenuItem>
                      <MenuItem value="Iceland">Iceland</MenuItem>
                      <MenuItem value="India">India</MenuItem>
                      <MenuItem value="Indonesia">Indonesia</MenuItem>
                      <MenuItem value="Iran, Islamic Republic Of">Iran, Islamic Republic Of</MenuItem>
                      <MenuItem value="Iraq">Iraq</MenuItem>
                      <MenuItem value="Ireland">Ireland</MenuItem>
                      <MenuItem value="Isle Of Man">Isle Of Man</MenuItem>
                      <MenuItem value="Israel">Israel</MenuItem>
                      <MenuItem value="Italy">Italy</MenuItem>
                      <MenuItem value="Jamaica">Jamaica</MenuItem>
                      <MenuItem value="Japan">Japan</MenuItem>
                      <MenuItem value="Jersey">Jersey</MenuItem>
                      <MenuItem value="Jordan">Jordan</MenuItem>
                      <MenuItem value="Kazakhstan">Kazakhstan</MenuItem>
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="Kiribati">Kiribati</MenuItem>
                      <MenuItem value="Korea, Democratic People's Republic Of">Korea, Democratic People's Republic Of</MenuItem>
                      <MenuItem value="Korea, Republic Of">Korea, Republic Of</MenuItem>
                      <MenuItem value="Kuwait">Kuwait</MenuItem>
                      <MenuItem value="Kyrgyzstan">Kyrgyzstan</MenuItem>
                      <MenuItem value="Lao People's Democratic Republic">Lao People's Democratic Republic</MenuItem>
                      <MenuItem value="Latvia">Latvia</MenuItem>
                      <MenuItem value="Lebanon">Lebanon</MenuItem>
                      <MenuItem value="Lesotho">Lesotho</MenuItem>
                      <MenuItem value="Liberia">Liberia</MenuItem>
                      <MenuItem value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</MenuItem>
                      <MenuItem value="Liechtenstein">Liechtenstein</MenuItem>
                      <MenuItem value="Lithuania">Lithuania</MenuItem>
                      <MenuItem value="Luxembourg">Luxembourg</MenuItem>
                      <MenuItem value="Macau">Macau</MenuItem>
                      <MenuItem value="Macedonia, The Former Yugoslav Republic Of">Macedonia, The Former Yugoslav Republic Of</MenuItem>
                      <MenuItem value="Madagascar">Madagascar</MenuItem>
                      <MenuItem value="Malawi">Malawi</MenuItem>
                      <MenuItem value="Malaysia">Malaysia</MenuItem>
                      <MenuItem value="Maldives">Maldives</MenuItem>
                      <MenuItem value="Mali">Mali</MenuItem>
                      <MenuItem value="Malta">Malta</MenuItem>
                      <MenuItem value="Marshall Islands">Marshall Islands</MenuItem>
                      <MenuItem value="Martinique">Martinique</MenuItem>
                      <MenuItem value="Mauritania">Mauritania</MenuItem>
                      <MenuItem value="Mauritius">Mauritius</MenuItem>
                      <MenuItem value="Mayotte">Mayotte</MenuItem>
                      <MenuItem value="Mexico">Mexico</MenuItem>
                      <MenuItem value="Micronesia, Federated States Of">Micronesia, Federated States Of</MenuItem>
                      <MenuItem value="Moldova, Republic Of">Moldova, Republic Of</MenuItem>
                      <MenuItem value="Monaco">Monaco</MenuItem>
                      <MenuItem value="Mongolia">Mongolia</MenuItem>
                      <MenuItem value="Montserrat">Montserrat</MenuItem>
                      <MenuItem value="Morocco">Morocco</MenuItem>
                      <MenuItem value="Mozambique">Mozambique</MenuItem>
                      <MenuItem value="Myanmar">Myanmar</MenuItem>
                      <MenuItem value="Namibia">Namibia</MenuItem>
                      <MenuItem value="Nauru">Nauru</MenuItem>
                      <MenuItem value="Nepal">Nepal</MenuItem>
                      <MenuItem value="Netherlands">Netherlands</MenuItem>
                      <MenuItem value="Netherlands Antilles">Netherlands Antilles</MenuItem>
                      <MenuItem value="New Caledonia">New Caledonia</MenuItem>
                      <MenuItem value="New Zealand">New Zealand</MenuItem>
                      <MenuItem value="Nicaragua">Nicaragua</MenuItem>
                      <MenuItem value="Niger">Niger</MenuItem>
                      <MenuItem value="Nigeria">Nigeria</MenuItem>
                      <MenuItem value="Niue">Niue</MenuItem>
                      <MenuItem value="Norfolk Island">Norfolk Island</MenuItem>
                      <MenuItem value="Northern Mariana Islands">Northern Mariana Islands</MenuItem>
                      <MenuItem value="Norway">Norway</MenuItem>
                      <MenuItem value="Oman">Oman</MenuItem>
                      <MenuItem value="Pakistan">Pakistan</MenuItem>
                      <MenuItem value="Palau">Palau</MenuItem>
                      <MenuItem value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</MenuItem>
                      <MenuItem value="Panama">Panama</MenuItem>
                      <MenuItem value="Papua New Guinea">Papua New Guinea</MenuItem>
                      <MenuItem value="Paraguay">Paraguay</MenuItem>
                      <MenuItem value="Peru">Peru</MenuItem>
                      <MenuItem value="Philippines">Philippines</MenuItem>
                      <MenuItem value="Pitcairn">Pitcairn</MenuItem>
                      <MenuItem value="Poland">Poland</MenuItem>
                      <MenuItem value="Portugal">Portugal</MenuItem>
                      <MenuItem value="Puerto Rico">Puerto Rico</MenuItem>
                      <MenuItem value="Qatar">Qatar</MenuItem>
                      <MenuItem value="Reunion">Reunion</MenuItem>
                      <MenuItem value="Romania">Romania</MenuItem>
                      <MenuItem value="Russian Federation">Russian Federation</MenuItem>
                      <MenuItem value="Rwanda">Rwanda</MenuItem>
                      <MenuItem value="Saint Helena">Saint Helena</MenuItem>
                      <MenuItem value="Saint Kitts And Nevis">Saint Kitts And Nevis</MenuItem>
                      <MenuItem value="Saint Lucia">Saint Lucia</MenuItem>
                      <MenuItem value="Saint Pierre And Miquelon">Saint Pierre And Miquelon</MenuItem>
                      <MenuItem value="Saint Vincent And The Grenadines">Saint Vincent And The Grenadines</MenuItem>
                      <MenuItem value="Samoa">Samoa</MenuItem>
                      <MenuItem value="San Marino">San Marino</MenuItem>
                      <MenuItem value="Sao Tome And Principe">Sao Tome And Principe</MenuItem>
                      <MenuItem value="Saudi Arabia">Saudi Arabia</MenuItem>
                      <MenuItem value="Senegal">Senegal</MenuItem>
                      <MenuItem value="Serbia And Montenegro">Serbia And Montenegro</MenuItem>
                      <MenuItem value="Seychelles">Seychelles</MenuItem>
                      <MenuItem value="Sierra Leone">Sierra Leone</MenuItem>
                      <MenuItem value="Singapore">Singapore</MenuItem>
                      <MenuItem value="Slovakia">Slovakia</MenuItem>
                      <MenuItem value="Slovenia">Slovenia</MenuItem>
                      <MenuItem value="Solomon Islands">Solomon Islands</MenuItem>
                      <MenuItem value="Somalia">Somalia</MenuItem>
                      <MenuItem value="South Africa">South Africa</MenuItem>
                      <MenuItem value="South Georgia And The South Sandwich Islands">South Georgia And The South Sandwich Islands</MenuItem>
                      <MenuItem value="Spain">Spain</MenuItem>
                      <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                      <MenuItem value="Sudan">Sudan</MenuItem>
                      <MenuItem value="Suriname">Suriname</MenuItem>
                      <MenuItem value="Svalbard And Jan Mayen">Svalbard And Jan Mayen</MenuItem>
                      <MenuItem value="Swaziland">Swaziland</MenuItem>
                      <MenuItem value="Sweden">Sweden</MenuItem>
                      <MenuItem value="Switzerland">Switzerland</MenuItem>
                      <MenuItem value="Syrian Arab Republic">Syrian Arab Republic</MenuItem>
                      <MenuItem value="Taiwan, Province Of China">Taiwan, Province Of China</MenuItem>
                      <MenuItem value="Tajikistan">Tajikistan</MenuItem>
                      <MenuItem value="Tanzania, United Republic Of">Tanzania, United Republic Of</MenuItem>
                      <MenuItem value="Thailand">Thailand</MenuItem>
                      <MenuItem value="Timor-Leste">Timor-Leste</MenuItem>
                      <MenuItem value="Togo">Togo</MenuItem>
                      <MenuItem value="Tokelau">Tokelau</MenuItem>
                      <MenuItem value="Tonga">Tonga</MenuItem>
                      <MenuItem value="Trinidad And Tobago">Trinidad And Tobago</MenuItem>
                      <MenuItem value="Tunisia">Tunisia</MenuItem>
                      <MenuItem value="Turkey">Turkey</MenuItem>
                      <MenuItem value="Turkmenistan">Turkmenistan</MenuItem>
                      <MenuItem value="Turks And Caicos Islands">Turks And Caicos Islands</MenuItem>
                      <MenuItem value="Tuvalu">Tuvalu</MenuItem>
                      <MenuItem value="Uganda">Uganda</MenuItem>
                      <MenuItem value="Ukraine">Ukraine</MenuItem>
                      <MenuItem value="United Arab Emirates">United Arab Emirates</MenuItem>
                      <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                      <MenuItem value="United States">United States</MenuItem>
                      <MenuItem value="United States Minor Outlying Islands">United States Minor Outlying Islands</MenuItem>
                      <MenuItem value="Uruguay">Uruguay</MenuItem>
                      <MenuItem value="Uzbekistan">Uzbekistan</MenuItem>
                      <MenuItem value="Vanuatu">Vanuatu</MenuItem>
                      <MenuItem value="Venezuela">Venezuela</MenuItem>
                      <MenuItem value="Viet Nam">Viet Nam</MenuItem>
                      <MenuItem value="Virgin Islands, British">Virgin Islands, British</MenuItem>
                      <MenuItem value="Virgin Islands, U.S.">Virgin Islands, U.S.</MenuItem>
                      <MenuItem value="Wallis And Futuna">Wallis And Futuna</MenuItem>
                      <MenuItem value="Western Sahara">Western Sahara</MenuItem>
                      <MenuItem value="Yemen">Yemen</MenuItem>
                      <MenuItem value="Zambia">Zambia</MenuItem>
                      <MenuItem value="Zimbabwe">Zimbabwe</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel id="currency-label">Currency</InputLabel>
                    <Select
                      labelId="currency-label"
                      id="currency"
                      name="currency"
                      value={formData.currency || ''}
                      label="Currency"
                      onChange={onInputChange}
                      required
                      sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="USD">USD (United States Dollar)</MenuItem>
                      <MenuItem value="EUR">EUR (Euro)</MenuItem>
                      <MenuItem value="GBP">GBP (British Pound)</MenuItem>
                      <MenuItem value="JPY">JPY (Japanese Yen)</MenuItem>
                      <MenuItem value="CAD">CAD (Canadian Dollar)</MenuItem>
                      <MenuItem value="AUD">AUD (Australian Dollar)</MenuItem>
                      <MenuItem value="CHF">CHF (Swiss Franc)</MenuItem>
                      <MenuItem value="CNY">CNY (Chinese Yuan)</MenuItem>
                      <MenuItem value="INR">INR (Indian Rupee)</MenuItem>
                      <MenuItem value="BRL">BRL (Brazilian Real)</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              <TextField label="Email" name="email" type="email" required fullWidth value={formData.email || ''} onChange={onInputChange} sx={fieldSx} />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                fullWidth
                value={formData.password || ''}
                onChange={onInputChange}
                sx={fieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {showPassword ? 'Hide' : 'Show'}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {isRegister && (
                <>
                  <TextField
                    label="Confirm password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    fullWidth
                    value={formData.confirmPassword || ''}
                    onChange={onInputChange}
                    sx={fieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {showConfirmPassword ? 'Hide' : 'Show'}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Captcha Placeholder */}
                  <Box sx={{ my: 2, p: 2, border: '1px dashed rgba(255,255,255,0.3)', borderRadius: 1, color: 'rgba(255,255,255,0.7)' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Please enter the following words: <strong style={{ color: '#7dd3fc', fontSize: '1.2em' }}>{captchaValue}</strong>
                    </Typography>
                    <TextField
                      label="Enter the words you see"
                      name="captcha"
                      fullWidth
                      value={formData.captcha || ''}
                      onChange={onInputChange}
                      sx={{ mt: 1, ...fieldSx }}
                    />
                  </Box>
                  {/* Terms and Conditions Checkbox */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="termsAccepted"
                        checked={formData.termsAccepted || false}
                        onChange={onCheckboxChange}
                        sx={{ color: '#7dd3fc' }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.74)' }}>
                        I accept the <Link to="/terms" style={{ color: '#7dd3fc' }}>Terms and Conditions</Link>.
                      </Typography>
                    }
                    sx={{ mt: 1, mb: 2 }}
                  />
                </>
              )}
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999, bgcolor: '#7dd3fc', color: '#03111d', '&:hover': { bgcolor: '#bae6fd' } }} disabled={loading}>
                {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.74)' }}>
              {isRegister ? (
                <>Already have an account? <Link to="/login" style={{ color: '#7dd3fc' }}>Sign in</Link></>
              ) : (
                <>
                  <Link to="/forgot-password" style={{ color: '#7dd3fc' }}>Forgot password?</Link>
                  {' • '}
                  <Link to="/register" style={{ color: '#7dd3fc' }}>Create account</Link>
                </>
              )}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

const fieldSx = {
  mb: 1.5,
  input: { color: 'white' },
  label: { color: 'rgba(255,255,255,0.7)' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&:hover fieldset': { borderColor: '#7dd3fc' },
    '&.Mui-focused fieldset': { borderColor: '#7dd3fc' },
  },
};

export default AuthForm;