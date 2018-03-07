

```python
import pandas as pd

schools_data_path = 'C:\\Users\\Scott\\Downloads\\UCBBE\\UCBB\\04-pandas\\Homework\\Instructions\\PyCitySchools\\raw_data\\schools_complete.csv'

student_data_path = 'C:\\Users\\Scott\\Downloads\\UCBBE\\UCBB\\04-pandas\\Homework\\Instructions\\PyCitySchools\\raw_data\\students_complete.csv'

```


```python
data_students = pd.read_csv(student_data_path)
data_schools = pd.read_csv(schools_data_path)
```


```python

```


```python
per_passing_math = 100*len(data_students[data_students.math_score >= 70])/len(data_students) 
per_passing_reading = 100*len(data_students[data_students.reading_score >= 70])/len(data_students)
per_passing = (per_passing_math + per_passing_reading)/2

print(data_students.reading_score.min())

#d =  {'id': 'CS2_056', 'cost': 2, 'name': 'Tap'}
#df = pd.DataFrame([d], columns=d.keys())

d =  {'Total Schools': len(data_schools),
      'Total students': len(data_students),
      'Total budget': data_schools.budget.sum(),
      'Average math score': data_students.math_score.mean(),
      'Percent math passing': per_passing_math,
      'Percent reading passing': per_passing_reading,
      'Percent passing':per_passing}

summary_df = pd.DataFrame([d], columns=d.keys())
                                            
summary_df.style.format({'Total budget':'${:,.0f}'.format,
                         'Percent math passing':'%{:,.1f}'.format,
                         'Percent reading passing':'%{:,.1f}'.format,
                         'Percent passing':'%{:,.1f}'.format,})
                                            
```

    63
    





        <style  type="text/css" >
        
        
        </style>

        <table id="T_1fb80636_21bb_11e8_8564_f0d5bf32424e" None>
        

        <thead>
            
            <tr>
                
                <th class="blank">
                
                <th class="col_heading level0 col0">Percent reading passing
                
                <th class="col_heading level0 col1">Percent math passing
                
                <th class="col_heading level0 col2">Total Schools
                
                <th class="col_heading level0 col3">Total budget
                
                <th class="col_heading level0 col4">Percent passing
                
                <th class="col_heading level0 col5">Average math score
                
                <th class="col_heading level0 col6">Total students
                
            </tr>
            
        </thead>
        <tbody>
            
            <tr>
                
                <th id="T_1fb80636_21bb_11e8_8564_f0d5bf32424e" class="row_heading level6 row0">
                    0
                
                <td id="T_1fb80636_21bb_11e8_8564_f0d5bf32424erow0_col0" class="data row0 col0">
                    %85.8
                
                <td id="T_1fb80636_21bb_11e8_8564_f0d5bf32424erow0_col1" class="data row0 col1">
                    %75.0
                
                <td id="T_1fb80636_21bb_11e8_8564_f0d5bf32424erow0_col2" class="data row0 col2">
                    15
                
                <td id="T_1fb80636_21bb_11e8_8564_f0d5bf32424erow0_col3" class="data row0 col3">
                    $24,649,428
                
                <td id="T_1fb80636_21bb_11e8_8564_f0d5bf32424erow0_col4" class="data row0 col4">
                    %80.4
                
                <td id="T_1fb80636_21bb_11e8_8564_f0d5bf32424erow0_col5" class="data row0 col5">
                    78.9854
                
                <td id="T_1fb80636_21bb_11e8_8564_f0d5bf32424erow0_col6" class="data row0 col6">
                    39170
                
            </tr>
            
        </tbody>
        </table>
        




```python
#print(data_students.keys())
#print(data_schools.keys())
print(data_students.head())
#print(data_schools.head)
```

       Student ID               name gender grade             school  \
    0           0       Paul Bradley      M   9th  Huang High School   
    1           1       Victor Smith      M  12th  Huang High School   
    2           2    Kevin Rodriguez      M  12th  Huang High School   
    3           3  Dr. Richard Scott      M  12th  Huang High School   
    4           4         Bonnie Ray      F   9th  Huang High School   
    
       reading_score  math_score  
    0             66          79  
    1             94          61  
    2             90          60  
    3             67          58  
    4             97          84  
    


```python
#Summary per school section
data_schools['Per Student Budget']=data_schools['budget']/data_schools['size']

#create a column for math pass = TRUE
data_students['math_pass']=data_students['math_score'] >= 70 
data_students['reading_pass']=data_students['reading_score'] >= 70 

#Find pass/fail mean
school_math_per_pass =  data_students.groupby(['school'])['math_pass'].mean()*100
school_reading_per_pass = data_students.groupby(['school'])['reading_pass'].mean()*100
school_overall_per_pass = (school_math_per_pass+school_reading_per_pass)/2

#find the means by the school
school_math_average =  data_students.groupby(['school'])['math_score'].mean()
school_reading_average = data_students.groupby(['school'])['reading_score'].mean()

#convert pandas seriers to dataFrame
school_math_average_df =  school_math_average.to_frame(name='math_score_average')
school_reading_average_df =  school_reading_average.to_frame(name='reading_score_average')
school_math_per_pass_df = school_math_per_pass.to_frame(name='math_per_pass')
school_reading_per_pass_df = school_reading_per_pass.to_frame(name='reading_per_pass')
school_overall_per_pass_df = school_overall_per_pass.to_frame(name='overall_per_pass')

#copy index as school to it's own column for tracking
school_math_average_df['school_m'] = school_math_average_df.index 
school_reading_average_df['school_r'] = school_reading_average_df.index
school_math_per_pass_df['school_m_p_pass'] = school_math_per_pass_df.index
school_reading_per_pass_df['school_r_p_pass'] = school_reading_per_pass_df.index
school_overall_per_pass_df['school_overall_p_pass'] = school_overall_per_pass_df.index

#the great merge
school_data_1 = pd.merge(data_schools,school_math_average_df,left_on='name',right_on='school_m')
school_data_1 = pd.merge(school_data_1,school_reading_average_df,left_on='name',right_on='school_r')
school_data_1 = pd.merge(school_data_1,school_math_per_pass_df,left_on='name',right_on='school_m_p_pass')
school_data_1 = pd.merge(school_data_1,school_reading_per_pass_df,left_on='name',right_on='school_r_p_pass')
school_data_1 = pd.merge(school_data_1,school_overall_per_pass_df,left_on='name',right_on='school_overall_p_pass')

#clean up the extra school name columns
#print(school_data_1.columns.tolist())
del_col = ['school_m','school_r','school_m_p_pass','school_overall_p_pass','school_r_p_pass']
school_data_1.drop(del_col,axis=1,inplace=True)

school_data_1.style.format({'budget':'${:,.0f}'.format,
                         'math_per_pass':'%{:,.1f}'.format,
                         'reading_per_pass':'%{:,.1f}'.format,
                         'overall_per_pass':'%{:,.1f}'.format,})

```





        <style  type="text/css" >
        
        
        </style>

        <table id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" None>
        

        <thead>
            
            <tr>
                
                <th class="blank">
                
                <th class="col_heading level0 col0">School ID
                
                <th class="col_heading level0 col1">name
                
                <th class="col_heading level0 col2">type
                
                <th class="col_heading level0 col3">size
                
                <th class="col_heading level0 col4">budget
                
                <th class="col_heading level0 col5">Per Student Budget
                
                <th class="col_heading level0 col6">math_score_average
                
                <th class="col_heading level0 col7">reading_score_average
                
                <th class="col_heading level0 col8">math_per_pass
                
                <th class="col_heading level0 col9">reading_per_pass
                
                <th class="col_heading level0 col10">overall_per_pass
                
            </tr>
            
        </thead>
        <tbody>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row0">
                    0
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col0" class="data row0 col0">
                    0
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col1" class="data row0 col1">
                    Huang High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col2" class="data row0 col2">
                    District
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col3" class="data row0 col3">
                    2917
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col4" class="data row0 col4">
                    $1,910,635
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col5" class="data row0 col5">
                    655
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col6" class="data row0 col6">
                    76.6294
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col7" class="data row0 col7">
                    81.1827
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col8" class="data row0 col8">
                    %65.7
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col9" class="data row0 col9">
                    %81.3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow0_col10" class="data row0 col10">
                    %73.5
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row1">
                    1
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col0" class="data row1 col0">
                    1
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col1" class="data row1 col1">
                    Figueroa High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col2" class="data row1 col2">
                    District
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col3" class="data row1 col3">
                    2949
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col4" class="data row1 col4">
                    $1,884,411
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col5" class="data row1 col5">
                    639
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col6" class="data row1 col6">
                    76.7118
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col7" class="data row1 col7">
                    81.158
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col8" class="data row1 col8">
                    %66.0
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col9" class="data row1 col9">
                    %80.7
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow1_col10" class="data row1 col10">
                    %73.4
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row2">
                    2
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col0" class="data row2 col0">
                    2
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col1" class="data row2 col1">
                    Shelton High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col2" class="data row2 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col3" class="data row2 col3">
                    1761
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col4" class="data row2 col4">
                    $1,056,600
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col5" class="data row2 col5">
                    600
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col6" class="data row2 col6">
                    83.3595
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col7" class="data row2 col7">
                    83.7257
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col8" class="data row2 col8">
                    %93.9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col9" class="data row2 col9">
                    %95.9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow2_col10" class="data row2 col10">
                    %94.9
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row3">
                    3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col0" class="data row3 col0">
                    3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col1" class="data row3 col1">
                    Hernandez High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col2" class="data row3 col2">
                    District
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col3" class="data row3 col3">
                    4635
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col4" class="data row3 col4">
                    $3,022,020
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col5" class="data row3 col5">
                    652
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col6" class="data row3 col6">
                    77.2898
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col7" class="data row3 col7">
                    80.9344
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col8" class="data row3 col8">
                    %66.8
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col9" class="data row3 col9">
                    %80.9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow3_col10" class="data row3 col10">
                    %73.8
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row4">
                    4
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col0" class="data row4 col0">
                    4
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col1" class="data row4 col1">
                    Griffin High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col2" class="data row4 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col3" class="data row4 col3">
                    1468
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col4" class="data row4 col4">
                    $917,500
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col5" class="data row4 col5">
                    625
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col6" class="data row4 col6">
                    83.3515
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col7" class="data row4 col7">
                    83.8168
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col8" class="data row4 col8">
                    %93.4
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col9" class="data row4 col9">
                    %97.1
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow4_col10" class="data row4 col10">
                    %95.3
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row5">
                    5
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col0" class="data row5 col0">
                    5
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col1" class="data row5 col1">
                    Wilson High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col2" class="data row5 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col3" class="data row5 col3">
                    2283
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col4" class="data row5 col4">
                    $1,319,574
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col5" class="data row5 col5">
                    578
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col6" class="data row5 col6">
                    83.2742
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col7" class="data row5 col7">
                    83.9895
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col8" class="data row5 col8">
                    %93.9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col9" class="data row5 col9">
                    %96.5
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow5_col10" class="data row5 col10">
                    %95.2
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row6">
                    6
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col0" class="data row6 col0">
                    6
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col1" class="data row6 col1">
                    Cabrera High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col2" class="data row6 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col3" class="data row6 col3">
                    1858
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col4" class="data row6 col4">
                    $1,081,356
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col5" class="data row6 col5">
                    582
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col6" class="data row6 col6">
                    83.0619
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col7" class="data row6 col7">
                    83.9758
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col8" class="data row6 col8">
                    %94.1
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col9" class="data row6 col9">
                    %97.0
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow6_col10" class="data row6 col10">
                    %95.6
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row7">
                    7
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col0" class="data row7 col0">
                    7
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col1" class="data row7 col1">
                    Bailey High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col2" class="data row7 col2">
                    District
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col3" class="data row7 col3">
                    4976
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col4" class="data row7 col4">
                    $3,124,928
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col5" class="data row7 col5">
                    628
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col6" class="data row7 col6">
                    77.0484
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col7" class="data row7 col7">
                    81.034
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col8" class="data row7 col8">
                    %66.7
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col9" class="data row7 col9">
                    %81.9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow7_col10" class="data row7 col10">
                    %74.3
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row8">
                    8
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col0" class="data row8 col0">
                    8
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col1" class="data row8 col1">
                    Holden High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col2" class="data row8 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col3" class="data row8 col3">
                    427
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col4" class="data row8 col4">
                    $248,087
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col5" class="data row8 col5">
                    581
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col6" class="data row8 col6">
                    83.8033
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col7" class="data row8 col7">
                    83.815
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col8" class="data row8 col8">
                    %92.5
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col9" class="data row8 col9">
                    %96.3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow8_col10" class="data row8 col10">
                    %94.4
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row9">
                    9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col0" class="data row9 col0">
                    9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col1" class="data row9 col1">
                    Pena High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col2" class="data row9 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col3" class="data row9 col3">
                    962
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col4" class="data row9 col4">
                    $585,858
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col5" class="data row9 col5">
                    609
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col6" class="data row9 col6">
                    83.8399
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col7" class="data row9 col7">
                    84.0447
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col8" class="data row9 col8">
                    %94.6
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col9" class="data row9 col9">
                    %95.9
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow9_col10" class="data row9 col10">
                    %95.3
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row10">
                    10
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col0" class="data row10 col0">
                    10
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col1" class="data row10 col1">
                    Wright High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col2" class="data row10 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col3" class="data row10 col3">
                    1800
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col4" class="data row10 col4">
                    $1,049,400
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col5" class="data row10 col5">
                    583
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col6" class="data row10 col6">
                    83.6822
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col7" class="data row10 col7">
                    83.955
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col8" class="data row10 col8">
                    %93.3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col9" class="data row10 col9">
                    %96.6
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow10_col10" class="data row10 col10">
                    %95.0
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row11">
                    11
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col0" class="data row11 col0">
                    11
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col1" class="data row11 col1">
                    Rodriguez High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col2" class="data row11 col2">
                    District
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col3" class="data row11 col3">
                    3999
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col4" class="data row11 col4">
                    $2,547,363
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col5" class="data row11 col5">
                    637
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col6" class="data row11 col6">
                    76.8427
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col7" class="data row11 col7">
                    80.7447
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col8" class="data row11 col8">
                    %66.4
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col9" class="data row11 col9">
                    %80.2
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow11_col10" class="data row11 col10">
                    %73.3
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row12">
                    12
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col0" class="data row12 col0">
                    12
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col1" class="data row12 col1">
                    Johnson High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col2" class="data row12 col2">
                    District
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col3" class="data row12 col3">
                    4761
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col4" class="data row12 col4">
                    $3,094,650
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col5" class="data row12 col5">
                    650
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col6" class="data row12 col6">
                    77.0725
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col7" class="data row12 col7">
                    80.9664
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col8" class="data row12 col8">
                    %66.1
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col9" class="data row12 col9">
                    %81.2
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow12_col10" class="data row12 col10">
                    %73.6
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row13">
                    13
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col0" class="data row13 col0">
                    13
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col1" class="data row13 col1">
                    Ford High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col2" class="data row13 col2">
                    District
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col3" class="data row13 col3">
                    2739
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col4" class="data row13 col4">
                    $1,763,916
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col5" class="data row13 col5">
                    644
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col6" class="data row13 col6">
                    77.1026
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col7" class="data row13 col7">
                    80.7463
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col8" class="data row13 col8">
                    %68.3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col9" class="data row13 col9">
                    %79.3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow13_col10" class="data row13 col10">
                    %73.8
                
            </tr>
            
            <tr>
                
                <th id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424e" class="row_heading level10 row14">
                    14
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col0" class="data row14 col0">
                    14
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col1" class="data row14 col1">
                    Thomas High School
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col2" class="data row14 col2">
                    Charter
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col3" class="data row14 col3">
                    1635
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col4" class="data row14 col4">
                    $1,043,130
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col5" class="data row14 col5">
                    638
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col6" class="data row14 col6">
                    83.4183
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col7" class="data row14 col7">
                    83.8489
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col8" class="data row14 col8">
                    %93.3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col9" class="data row14 col9">
                    %97.3
                
                <td id="T_1ff81c78_21bb_11e8_9f27_f0d5bf32424erow14_col10" class="data row14 col10">
                    %95.3
                
            </tr>
            
        </tbody>
        </table>
        




```python
print('Top 5 performing schools')
school_data_1.sort_values(['overall_per_pass'],ascending=False).head(5)
```

    Top 5 performing schools
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School ID</th>
      <th>name</th>
      <th>type</th>
      <th>size</th>
      <th>budget</th>
      <th>Per Student Budget</th>
      <th>math_score_average</th>
      <th>reading_score_average</th>
      <th>math_per_pass</th>
      <th>reading_per_pass</th>
      <th>overall_per_pass</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>6</th>
      <td>6</td>
      <td>Cabrera High School</td>
      <td>Charter</td>
      <td>1858</td>
      <td>1081356</td>
      <td>582.0</td>
      <td>83.061895</td>
      <td>83.975780</td>
      <td>94.133477</td>
      <td>97.039828</td>
      <td>95.586652</td>
    </tr>
    <tr>
      <th>14</th>
      <td>14</td>
      <td>Thomas High School</td>
      <td>Charter</td>
      <td>1635</td>
      <td>1043130</td>
      <td>638.0</td>
      <td>83.418349</td>
      <td>83.848930</td>
      <td>93.272171</td>
      <td>97.308869</td>
      <td>95.290520</td>
    </tr>
    <tr>
      <th>9</th>
      <td>9</td>
      <td>Pena High School</td>
      <td>Charter</td>
      <td>962</td>
      <td>585858</td>
      <td>609.0</td>
      <td>83.839917</td>
      <td>84.044699</td>
      <td>94.594595</td>
      <td>95.945946</td>
      <td>95.270270</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>Griffin High School</td>
      <td>Charter</td>
      <td>1468</td>
      <td>917500</td>
      <td>625.0</td>
      <td>83.351499</td>
      <td>83.816757</td>
      <td>93.392371</td>
      <td>97.138965</td>
      <td>95.265668</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>Wilson High School</td>
      <td>Charter</td>
      <td>2283</td>
      <td>1319574</td>
      <td>578.0</td>
      <td>83.274201</td>
      <td>83.989488</td>
      <td>93.867718</td>
      <td>96.539641</td>
      <td>95.203679</td>
    </tr>
  </tbody>
</table>
</div>




```python
print('Bottom 5 performing schools')
school_data_1.sort_values(['overall_per_pass'],ascending=True).head(5)
```

    Bottom 5 performing schools
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School ID</th>
      <th>name</th>
      <th>type</th>
      <th>size</th>
      <th>budget</th>
      <th>Per Student Budget</th>
      <th>math_score_average</th>
      <th>reading_score_average</th>
      <th>math_per_pass</th>
      <th>reading_per_pass</th>
      <th>overall_per_pass</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>11</th>
      <td>11</td>
      <td>Rodriguez High School</td>
      <td>District</td>
      <td>3999</td>
      <td>2547363</td>
      <td>637.0</td>
      <td>76.842711</td>
      <td>80.744686</td>
      <td>66.366592</td>
      <td>80.220055</td>
      <td>73.293323</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>Figueroa High School</td>
      <td>District</td>
      <td>2949</td>
      <td>1884411</td>
      <td>639.0</td>
      <td>76.711767</td>
      <td>81.158020</td>
      <td>65.988471</td>
      <td>80.739234</td>
      <td>73.363852</td>
    </tr>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>Huang High School</td>
      <td>District</td>
      <td>2917</td>
      <td>1910635</td>
      <td>655.0</td>
      <td>76.629414</td>
      <td>81.182722</td>
      <td>65.683922</td>
      <td>81.316421</td>
      <td>73.500171</td>
    </tr>
    <tr>
      <th>12</th>
      <td>12</td>
      <td>Johnson High School</td>
      <td>District</td>
      <td>4761</td>
      <td>3094650</td>
      <td>650.0</td>
      <td>77.072464</td>
      <td>80.966394</td>
      <td>66.057551</td>
      <td>81.222432</td>
      <td>73.639992</td>
    </tr>
    <tr>
      <th>13</th>
      <td>13</td>
      <td>Ford High School</td>
      <td>District</td>
      <td>2739</td>
      <td>1763916</td>
      <td>644.0</td>
      <td>77.102592</td>
      <td>80.746258</td>
      <td>68.309602</td>
      <td>79.299014</td>
      <td>73.804308</td>
    </tr>
  </tbody>
</table>
</div>




```python
#group by school and grade then take the mean of math_scote
math_by_grade = data_students.groupby(['school','grade'])['math_score'].mean()

#mess with dataframe layout to get something presentable
math_by_grade_unstacked = math_by_grade.unstack(level=1)
cols = [ '9th','10th', '11th', '12th']
math_by_grade_unstacked = math_by_grade_unstacked[cols]

#final output
print('Math scores per grade level and school')
math_by_grade_unstacked.style.format({'9th':'{:,.1f}'.format,
                                     '10th':'{:,.1f}'.format,
                                     '11th':'{:,.1f}'.format,
                                     '12th':'{:,.1f}'.format})

```

    Math scores per grade level and school
    





        <style  type="text/css" >
        
        
        </style>

        <table id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" None>
        

        <thead>
            
            <tr>
                
                <th class="blank">
                
                <th class="col_heading level0 col0">9th
                
                <th class="col_heading level0 col1">10th
                
                <th class="col_heading level0 col2">11th
                
                <th class="col_heading level0 col3">12th
                
            </tr>
            
            <tr>
                
                <th class="col_heading level2 col0">school
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
            </tr>
            
        </thead>
        <tbody>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level0 row0">
                    Bailey High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow0_col0" class="data row0 col0">
                    77.1
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow0_col1" class="data row0 col1">
                    77.0
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow0_col2" class="data row0 col2">
                    77.5
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow0_col3" class="data row0 col3">
                    76.5
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row1">
                    Cabrera High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow1_col0" class="data row1 col0">
                    83.1
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow1_col1" class="data row1 col1">
                    83.2
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow1_col2" class="data row1 col2">
                    82.8
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow1_col3" class="data row1 col3">
                    83.3
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row2">
                    Figueroa High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow2_col0" class="data row2 col0">
                    76.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow2_col1" class="data row2 col1">
                    76.5
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow2_col2" class="data row2 col2">
                    76.9
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow2_col3" class="data row2 col3">
                    77.2
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row3">
                    Ford High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow3_col0" class="data row3 col0">
                    77.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow3_col1" class="data row3 col1">
                    77.7
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow3_col2" class="data row3 col2">
                    76.9
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow3_col3" class="data row3 col3">
                    76.2
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row4">
                    Griffin High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow4_col0" class="data row4 col0">
                    82.0
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow4_col1" class="data row4 col1">
                    84.2
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow4_col2" class="data row4 col2">
                    83.8
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow4_col3" class="data row4 col3">
                    83.4
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row5">
                    Hernandez High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow5_col0" class="data row5 col0">
                    77.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow5_col1" class="data row5 col1">
                    77.3
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow5_col2" class="data row5 col2">
                    77.1
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow5_col3" class="data row5 col3">
                    77.2
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row6">
                    Holden High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow6_col0" class="data row6 col0">
                    83.8
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow6_col1" class="data row6 col1">
                    83.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow6_col2" class="data row6 col2">
                    85.0
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow6_col3" class="data row6 col3">
                    82.9
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row7">
                    Huang High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow7_col0" class="data row7 col0">
                    77.0
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow7_col1" class="data row7 col1">
                    75.9
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow7_col2" class="data row7 col2">
                    76.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow7_col3" class="data row7 col3">
                    77.2
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row8">
                    Johnson High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow8_col0" class="data row8 col0">
                    77.2
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow8_col1" class="data row8 col1">
                    76.7
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow8_col2" class="data row8 col2">
                    77.5
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow8_col3" class="data row8 col3">
                    76.9
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row9">
                    Pena High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow9_col0" class="data row9 col0">
                    83.6
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow9_col1" class="data row9 col1">
                    83.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow9_col2" class="data row9 col2">
                    84.3
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow9_col3" class="data row9 col3">
                    84.1
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row10">
                    Rodriguez High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow10_col0" class="data row10 col0">
                    76.9
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow10_col1" class="data row10 col1">
                    76.6
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow10_col2" class="data row10 col2">
                    76.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow10_col3" class="data row10 col3">
                    77.7
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row11">
                    Shelton High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow11_col0" class="data row11 col0">
                    83.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow11_col1" class="data row11 col1">
                    82.9
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow11_col2" class="data row11 col2">
                    83.4
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow11_col3" class="data row11 col3">
                    83.8
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row12">
                    Thomas High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow12_col0" class="data row12 col0">
                    83.6
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow12_col1" class="data row12 col1">
                    83.1
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow12_col2" class="data row12 col2">
                    83.5
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow12_col3" class="data row12 col3">
                    83.5
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row13">
                    Wilson High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow13_col0" class="data row13 col0">
                    83.1
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow13_col1" class="data row13 col1">
                    83.7
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow13_col2" class="data row13 col2">
                    83.2
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow13_col3" class="data row13 col3">
                    83.0
                
            </tr>
            
            <tr>
                
                <th id="T_202a7718_21bb_11e8_995f_f0d5bf32424e" class="row_heading level3 row14">
                    Wright High School
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow14_col0" class="data row14 col0">
                    83.3
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow14_col1" class="data row14 col1">
                    84.0
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow14_col2" class="data row14 col2">
                    83.8
                
                <td id="T_202a7718_21bb_11e8_995f_f0d5bf32424erow14_col3" class="data row14 col3">
                    83.6
                
            </tr>
            
        </tbody>
        </table>
        




```python
#group by school and grade then take the mean of reading_scote
math_by_grade = data_students.groupby(['school','grade'])['reading_score'].mean()

#mess with dataframe layout to get something presentable
math_by_grade_unstacked = math_by_grade.unstack(level=1)
cols = [ '9th','10th', '11th', '12th']
math_by_grade_unstacked = math_by_grade_unstacked[cols]

#final output
print('Reading scores per grade level and school')
math_by_grade_unstacked.style.format({'9th':'{:,.1f}'.format,
                                     '10th':'{:,.1f}'.format,
                                     '11th':'{:,.1f}'.format,
                                     '12th':'{:,.1f}'.format})
```

    Reading scores per grade level and school
    





        <style  type="text/css" >
        
        
        </style>

        <table id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" None>
        

        <thead>
            
            <tr>
                
                <th class="blank">
                
                <th class="col_heading level0 col0">9th
                
                <th class="col_heading level0 col1">10th
                
                <th class="col_heading level0 col2">11th
                
                <th class="col_heading level0 col3">12th
                
            </tr>
            
            <tr>
                
                <th class="col_heading level2 col0">school
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
            </tr>
            
        </thead>
        <tbody>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level0 row0">
                    Bailey High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow0_col0" class="data row0 col0">
                    81.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow0_col1" class="data row0 col1">
                    80.9
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow0_col2" class="data row0 col2">
                    80.9
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow0_col3" class="data row0 col3">
                    80.9
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row1">
                    Cabrera High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow1_col0" class="data row1 col0">
                    83.7
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow1_col1" class="data row1 col1">
                    84.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow1_col2" class="data row1 col2">
                    83.8
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow1_col3" class="data row1 col3">
                    84.3
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row2">
                    Figueroa High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow2_col0" class="data row2 col0">
                    81.2
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow2_col1" class="data row2 col1">
                    81.4
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow2_col2" class="data row2 col2">
                    80.6
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow2_col3" class="data row2 col3">
                    81.4
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row3">
                    Ford High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow3_col0" class="data row3 col0">
                    80.6
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow3_col1" class="data row3 col1">
                    81.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow3_col2" class="data row3 col2">
                    80.4
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow3_col3" class="data row3 col3">
                    80.7
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row4">
                    Griffin High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow4_col0" class="data row4 col0">
                    83.4
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow4_col1" class="data row4 col1">
                    83.7
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow4_col2" class="data row4 col2">
                    84.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow4_col3" class="data row4 col3">
                    84.0
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row5">
                    Hernandez High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow5_col0" class="data row5 col0">
                    80.9
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow5_col1" class="data row5 col1">
                    80.7
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow5_col2" class="data row5 col2">
                    81.4
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow5_col3" class="data row5 col3">
                    80.9
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row6">
                    Holden High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow6_col0" class="data row6 col0">
                    83.7
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow6_col1" class="data row6 col1">
                    83.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow6_col2" class="data row6 col2">
                    83.8
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow6_col3" class="data row6 col3">
                    84.7
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row7">
                    Huang High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow7_col0" class="data row7 col0">
                    81.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow7_col1" class="data row7 col1">
                    81.5
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow7_col2" class="data row7 col2">
                    81.4
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow7_col3" class="data row7 col3">
                    80.3
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row8">
                    Johnson High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow8_col0" class="data row8 col0">
                    81.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow8_col1" class="data row8 col1">
                    80.8
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow8_col2" class="data row8 col2">
                    80.6
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow8_col3" class="data row8 col3">
                    81.2
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row9">
                    Pena High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow9_col0" class="data row9 col0">
                    83.8
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow9_col1" class="data row9 col1">
                    83.6
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow9_col2" class="data row9 col2">
                    84.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow9_col3" class="data row9 col3">
                    84.6
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row10">
                    Rodriguez High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow10_col0" class="data row10 col0">
                    81.0
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow10_col1" class="data row10 col1">
                    80.6
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow10_col2" class="data row10 col2">
                    80.9
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow10_col3" class="data row10 col3">
                    80.4
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row11">
                    Shelton High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow11_col0" class="data row11 col0">
                    84.1
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow11_col1" class="data row11 col1">
                    83.4
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow11_col2" class="data row11 col2">
                    84.4
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow11_col3" class="data row11 col3">
                    82.8
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row12">
                    Thomas High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow12_col0" class="data row12 col0">
                    83.7
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow12_col1" class="data row12 col1">
                    84.3
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow12_col2" class="data row12 col2">
                    83.6
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow12_col3" class="data row12 col3">
                    83.8
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row13">
                    Wilson High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow13_col0" class="data row13 col0">
                    83.9
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow13_col1" class="data row13 col1">
                    84.0
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow13_col2" class="data row13 col2">
                    83.8
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow13_col3" class="data row13 col3">
                    84.3
                
            </tr>
            
            <tr>
                
                <th id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424e" class="row_heading level3 row14">
                    Wright High School
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow14_col0" class="data row14 col0">
                    83.8
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow14_col1" class="data row14 col1">
                    83.8
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow14_col2" class="data row14 col2">
                    84.2
                
                <td id="T_2045ee58_21bb_11e8_9e9e_f0d5bf32424erow14_col3" class="data row14 col3">
                    84.1
                
            </tr>
            
        </tbody>
        </table>
        




```python
#%matplotlib inline
#school_data_1['Per Student Budget'].hist()
```


```python
import numpy as np
bins = np.linspace(school_data_1['Per Student Budget'].min(),school_data_1['Per Student Budget'].max(),num=5)
group_labels = ['$'+str(round(bins[0])) + ' to ' + str(round(bins[1])),
                '$'+str(round(bins[1])) + ' to ' + str(round(bins[2])),
                '$'+str(round(bins[2])) + ' to ' + str(round(bins[3])),
                '$'+str(round(bins[3])) + ' to ' + str(round(bins[4]))]


school_data_1['Spending Ranges (Per Student)'] = pd.cut( school_data_1['Per Student Budget'],bins, labels=group_labels)

# Create a GroupBy object based upon "View Group"
school_budget_group = school_data_1.groupby('Spending Ranges (Per Student)')

#average the catagories
temp_df = school_budget_group['math_score_average','reading_score_average',
                          'math_per_pass','reading_per_pass','overall_per_pass'].mean()
#
print('Spending per student and outcome')
temp_df.style.format({            'math_score_average':'{:,.1f}'.format,
                                     'reading_score_average':'{:,.1f}'.format,
                                             'math_per_pass':'{:,.1f}'.format,
                                          'reading_per_pass':'{:,.1f}'.format,
                                          'overall_per_pass':'{:,.1f}'.format})

```

    Spending per student and outcome
    





        <style  type="text/css" >
        
        
        </style>

        <table id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424e" None>
        

        <thead>
            
            <tr>
                
                <th class="blank">
                
                <th class="col_heading level0 col0">math_score_average
                
                <th class="col_heading level0 col1">reading_score_average
                
                <th class="col_heading level0 col2">math_per_pass
                
                <th class="col_heading level0 col3">reading_per_pass
                
                <th class="col_heading level0 col4">overall_per_pass
                
            </tr>
            
            <tr>
                
                <th class="col_heading level2 col0">Spending Ranges (Per Student)
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
            </tr>
            
        </thead>
        <tbody>
            
            <tr>
                
                <th id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424e" class="row_heading level0 row0">
                    $578.0 to 597.0
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow0_col0" class="data row0 col0">
                    83.5
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow0_col1" class="data row0 col1">
                    83.9
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow0_col2" class="data row0 col2">
                    93.3
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow0_col3" class="data row0 col3">
                    96.6
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow0_col4" class="data row0 col4">
                    95.0
                
            </tr>
            
            <tr>
                
                <th id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424e" class="row_heading level4 row1">
                    $597.0 to 616.0
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow1_col0" class="data row1 col0">
                    83.6
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow1_col1" class="data row1 col1">
                    83.9
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow1_col2" class="data row1 col2">
                    94.2
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow1_col3" class="data row1 col3">
                    95.9
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow1_col4" class="data row1 col4">
                    95.1
                
            </tr>
            
            <tr>
                
                <th id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424e" class="row_heading level4 row2">
                    $616.0 to 636.0
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow2_col0" class="data row2 col0">
                    80.2
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow2_col1" class="data row2 col1">
                    82.4
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow2_col2" class="data row2 col2">
                    80.0
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow2_col3" class="data row2 col3">
                    89.5
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow2_col4" class="data row2 col4">
                    84.8
                
            </tr>
            
            <tr>
                
                <th id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424e" class="row_heading level4 row3">
                    $636.0 to 655.0
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow3_col0" class="data row3 col0">
                    77.9
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow3_col1" class="data row3 col1">
                    81.4
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow3_col2" class="data row3 col2">
                    70.3
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow3_col3" class="data row3 col3">
                    83.0
                
                <td id="T_207e6378_21bb_11e8_a5dd_f0d5bf32424erow3_col4" class="data row3 col4">
                    76.7
                
            </tr>
            
        </tbody>
        </table>
        




```python
#school_data_1['size'].hist()
```


```python
import numpy as np
bins = np.linspace(school_data_1['size'].min(),school_data_1['size'].max(),num=4)
group_labels = ['Small ('+str(round(bins[0])) + ' to ' + str(round(bins[1])) + ')',
                'Medium ('+str(round(bins[1])) + ' to ' + str(round(bins[2]))+ ')',
                'Large ('+str(round(bins[2])) + ' to ' + str(round(bins[3]))+ ')']


school_data_1['Size range'] = pd.cut( school_data_1['size'],bins, labels=group_labels)

# Create a GroupBy object based upon "View Group"
school_size_group = school_data_1.groupby('Size range')

#average the catagories
temp_df = school_size_group['math_score_average','reading_score_average',
                          'math_per_pass','reading_per_pass','overall_per_pass'].mean()
temp_df['size_group_count']=school_size_group['Size range'].count()
#
print('School size and outcome')
temp_df.style.format({            'math_score_average':'{:,.1f}'.format,
                                     'reading_score_average':'{:,.1f}'.format,
                                             'math_per_pass':'{:,.1f}'.format,
                                          'reading_per_pass':'{:,.1f}'.format,
                                          'overall_per_pass':'{:,.1f}'.format})
```

    School size and outcome
    





        <style  type="text/css" >
        
        
        </style>

        <table id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424e" None>
        

        <thead>
            
            <tr>
                
                <th class="blank">
                
                <th class="col_heading level0 col0">math_score_average
                
                <th class="col_heading level0 col1">reading_score_average
                
                <th class="col_heading level0 col2">math_per_pass
                
                <th class="col_heading level0 col3">reading_per_pass
                
                <th class="col_heading level0 col4">overall_per_pass
                
                <th class="col_heading level0 col5">size_group_count
                
            </tr>
            
            <tr>
                
                <th class="col_heading level2 col0">Size range
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
            </tr>
            
        </thead>
        <tbody>
            
            <tr>
                
                <th id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424e" class="row_heading level0 row0">
                    Small (427.0 to 1943.0)
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow0_col0" class="data row0 col0">
                    83.5
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow0_col1" class="data row0 col1">
                    83.9
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow0_col2" class="data row0 col2">
                    93.8
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow0_col3" class="data row0 col3">
                    96.6
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow0_col4" class="data row0 col4">
                    95.2
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow0_col5" class="data row0 col5">
                    6
                
            </tr>
            
            <tr>
                
                <th id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424e" class="row_heading level5 row1">
                    Medium (1943.0 to 3460.0)
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow1_col0" class="data row1 col0">
                    78.4
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow1_col1" class="data row1 col1">
                    81.8
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow1_col2" class="data row1 col2">
                    73.5
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow1_col3" class="data row1 col3">
                    84.5
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow1_col4" class="data row1 col4">
                    79.0
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow1_col5" class="data row1 col5">
                    4
                
            </tr>
            
            <tr>
                
                <th id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424e" class="row_heading level5 row2">
                    Large (3460.0 to 4976.0)
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow2_col0" class="data row2 col0">
                    77.1
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow2_col1" class="data row2 col1">
                    80.9
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow2_col2" class="data row2 col2">
                    66.5
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow2_col3" class="data row2 col3">
                    81.1
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow2_col4" class="data row2 col4">
                    73.8
                
                <td id="T_209e6e9a_21bb_11e8_9f3c_f0d5bf32424erow2_col5" class="data row2 col5">
                    4
                
            </tr>
            
        </tbody>
        </table>
        




```python
school_type_group = school_data_1.groupby('type')

#average the catagories
temp_df = school_type_group['math_score_average','reading_score_average',
                          'math_per_pass','reading_per_pass','overall_per_pass'].mean()

print('School size and outcome')
temp_df.style.format({            'math_score_average':'{:,.1f}'.format,
                                     'reading_score_average':'{:,.1f}'.format,
                                             'math_per_pass':'{:,.1f}'.format,
                                          'reading_per_pass':'{:,.1f}'.format,
                                          'overall_per_pass':'{:,.1f}'.format})
```

    School size and outcome
    





        <style  type="text/css" >
        
        
        </style>

        <table id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424e" None>
        

        <thead>
            
            <tr>
                
                <th class="blank">
                
                <th class="col_heading level0 col0">math_score_average
                
                <th class="col_heading level0 col1">reading_score_average
                
                <th class="col_heading level0 col2">math_per_pass
                
                <th class="col_heading level0 col3">reading_per_pass
                
                <th class="col_heading level0 col4">overall_per_pass
                
            </tr>
            
            <tr>
                
                <th class="col_heading level2 col0">type
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
                <th class="blank">
                
            </tr>
            
        </thead>
        <tbody>
            
            <tr>
                
                <th id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424e" class="row_heading level0 row0">
                    Charter
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow0_col0" class="data row0 col0">
                    83.5
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow0_col1" class="data row0 col1">
                    83.9
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow0_col2" class="data row0 col2">
                    93.6
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow0_col3" class="data row0 col3">
                    96.6
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow0_col4" class="data row0 col4">
                    95.1
                
            </tr>
            
            <tr>
                
                <th id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424e" class="row_heading level4 row1">
                    District
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow1_col0" class="data row1 col0">
                    77.0
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow1_col1" class="data row1 col1">
                    81.0
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow1_col2" class="data row1 col2">
                    66.5
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow1_col3" class="data row1 col3">
                    80.8
                
                <td id="T_20b3cb58_21bb_11e8_9b16_f0d5bf32424erow1_col4" class="data row1 col4">
                    73.7
                
            </tr>
            
        </tbody>
        </table>
        




```python
# Observations
# 1) Charter schools outperform District schools by a wide margin. As with most data sets, sometimes the data doesn't fully 
#   capture the environment.  In this case what is not captured in data is the amount of parental involvement.  From other 
#   sets, and personal observation, Charter schools are not the default school, so parents have to actively work to get
#   their child into a Charted school.  These are the same parents that are generally more involved at home also. The 
#   Charter schools have parents that have self selected. 
# 2) Just having more money does get better results. But this could be a false conclusion because we don't know the
#    of student at each school.  For example some schools cater to single mothers and provide day care for the mothers.
#    This is a different situation than a school with kids from 40 year old parents with PhD's.
# 3) Schools perform pretty much the same on reading, and distinguish themselves on math.

```
