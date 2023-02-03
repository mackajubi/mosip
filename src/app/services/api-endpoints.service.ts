import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiEndpointsService {

  /* Wordpress: Content Management System End Points */
  news = environment.cmsBaseUrlProxy + 'news?_embed';
  tenders = environment.cmsBaseUrlProxy + 'tenders?_embed';  
  publications = environment.cmsBaseUrlProxy + 'publications?_embed';

  /* API ENDPOINTS */
  get_application_status = environment.pythonApi + 'get_application_status/re-capture'; 
  get_otp = environment.pythonApi + 'get_otp'; 
  ref_data_country = environment.pythonApi + 'reference_data/country'; 
  ref_data_county = environment.pythonApi + 'reference_data/county'; 
  ref_data_sub_county = environment.pythonApi + 'reference_data/sub_county'; 
  ref_data_parish = environment.pythonApi + 'reference_data/parish'; 
  ref_data_village = environment.pythonApi + 'reference_data/village'; 
  ref_data_disability = environment.pythonApi + 'reference_data/disability'; 
  ref_data_district = environment.pythonApi + 'reference_data/district'; 
  ref_data_religion = environment.pythonApi + 'reference_data/religion';
  ref_data_health_facility = environment.pythonApi + 'reference_data/health_facility'; 
  ref_data_causes_of_death = environment.pythonApi + 'reference_data/causes_of_death'; 
  ref_data_occupation = environment.pythonApi + 'reference_data/occupation';  
  form_3_nin = environment.pythonApi + 'form_3_nin'; 
  form_3_child = environment.pythonApi + 'form_3_child'; 
  form_12_death = environment.pythonApi + 'form_12_death'; 
  get_prn = environment.pythonApi + 'prn/generate'; 
  check_prn_status = environment.pythonApi + 'prn/check_status'; 
  check_nin = environment.pythonApi + 'nin/check'; 
  check_document_status = environment.pythonApi + 'confirm/reference_no'; 
  check_birth_certificate_status = environment.pythonApi + 'confirm/birth_certificate'; 
  check_death_certificate_status = environment.pythonApi + 'confirm/death_certificate'; 
  download_confirmation_of_info_document = environment.pythonApi + 'transaction/complete'; 
  get_all_organisations = environment.pythonApi + 'organisations/all'; 
  form_1_cop = environment.pythonApi + 'form_1_cop'; 
  birth_song_competition = environment.pythonApi + 'birth_song_competition'; 
  nin_slip = environment.pythonApi + 'ninslip/byappid'; 
  nin_slip_verify = environment.pythonApi + 'ninslip/verify'; 

  constructor() { }

}
