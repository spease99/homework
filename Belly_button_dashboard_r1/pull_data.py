import pandas as pd


samples_df = pd.read_csv('DataSets\\belly_button_biodiversity_samples.csv') 
otu_df = pd.read_csv('DataSets\\belly_button_biodiversity_otu_id.csv') 
meta_data_df = pd.read_csv('DataSets\\Belly_Button_Biodiversity_Metadata.csv') 
meta_data_df['WFREQ'].fillna(value = -1,inplace = True )
meta_data_df['WFREQ_int'] =meta_data_df['WFREQ'].astype(int)


def pull_sample_names():
    #samples_df   
    samples_available = samples_df.keys()[1:].tolist()
    return samples_available

def pull_sample_names_dict():
    #samples_df   
    samples_available = samples_df.keys()[1:].tolist()
    print('pull_sample_names_dict() called')
    sample_dict = {'samples':samples_available}
    #print('sample_dict=' + str(sample_dict))
    return sample_dict    
    
    
def pull_otu_description():
    otu_description = otu_df.lowest_taxonomic_unit_found.tolist()
    return otu_description 
    
def pull_meta_data(sample):
    sample_id = sample.split('_')[1]
    record = meta_data_df.loc[meta_data_df['SAMPLEID']== int(sample_id)]
    sample_list = record[['AGE','BBTYPE','ETHNICITY','GENDER','LOCATION','SAMPLEID']].to_json(orient='records')
    sample_json = sample_list[1:-1]  #drop the leading and trailing square brackets
    return sample_json
    
def pull_washing_freq(sample):
    sample_id = sample.split('_')[1]
    record = meta_data_df.loc[meta_data_df['SAMPLEID'] == int(sample_id)] 
    weekly_freq = record.WFREQ_int
    return weekly_freq   
    

def pull_sample(sample):
    return