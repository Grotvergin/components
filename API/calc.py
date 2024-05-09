import diode_squares as ds
import numpy as np

def CalculateVoltAmpere(data):
    
    _Vf = np.array(data.get("Vf"))         
    _If = np.array(data.get("If"))   
    # print("calc.py -> calculateVoltAmpere", "If: ", _If, "Vf: ", _Vf)
    return ds.prepare_vach(_If, _Vf)

def CalculateVoltCapacitance(data):
    _C = np.array(data.get("C"))      
    _Vr = np.array(data.get("Vr")) 
     
    return ds.prepare_cap(_C, _Vr)

def CalculateReverseRecoveryTime(data):
    _Trr = np.array(data.get("Trr"))  
    _Ir = np.array(data.get("Ir")) 
    return ds.prepare_rev(_Trr, _Ir)   

def CalculateTempratureСoefficient(data):
    _Temp = np.array(data.get("Temp"))  
    _It = np.array(data.get("It"))
    print("calc.py -> calculateVoltAmpere", "C: ", _Temp, "Vr: ", _It) 
    return ds.prepare_temp(_Temp, _It)