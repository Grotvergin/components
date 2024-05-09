from numpy import vectorize, ndarray, array
from math import log, log10, sin
from scipy.optimize import least_squares

ln = vectorize(log)
lg = vectorize(log10)

# Default parameters
ISmin = 10e-15
ISmax = 1e-6
ISinit = 1.0e-8
# ------------
Nmin = 1
Nmax = 3
Ninit = 1
# ------------
RSmin = 0.001
RSmax = 10.5
RSinit = 1
# ------------
VJmin = 0.1
VJmax = 1.5
VJinit = 1.2
# ------------
Mmin = 0.01
Mmax = 0.9
Minit = 0.33
# ------------
CJ0min = 0.01
CJ0max = 20.0
CJ0init = 0.01
# ------------
TTmin = 0.001
TTmax = 1000
TTinit = 1
# ------------
q = 1.6e-19
k = 1.38e-23
EG = 1.11
Ntemp = 2.98
# ------------


class Model:
    def __init__(self, min_val: float, max_val: float) -> None:
        self.min = min_val
        self.max = max_val

    def calculateModel(self, p: float) -> float:
        return self.min + (self.max - self.min) * sin(p) ** 2


class ModelVach:
    def __init__(self, RS_min: float, RS_max: float, N_min: float, N_max: float, IS_min: float, IS_max: float) -> None:
        self.RS = Model(RS_min, RS_max)
        self.N = Model(N_min, N_max)
        self.IS = Model(IS_min, IS_max)

    def calculate(self, p: list[float], x: ndarray) -> ndarray:
        RS = self.RS.calculateModel(p[0])
        N = self.N.calculateModel(p[1])
        IS = self.IS.calculateModel(p[2])
        return 0.025 * N * ln(x / IS) + x * RS


class ModelCap:
    def __init__(self, M_min: float, M_max: float, VJ_min: float, VJ_max: float, CJ0_min: float, CJ0_max: float) -> None:
        self.M = Model(M_min, M_max)
        self.VJ = Model(VJ_min, VJ_max)
        self.CJ0 = Model(CJ0_min, CJ0_max)

    def calculate(self, p: list[float], x: ndarray) -> ndarray:
        M = self.M.calculateModel(p[0])
        VJ = self.VJ.calculateModel(p[1])
        CJ0 = self.CJ0.calculateModel(p[2])
        return CJ0 / (1 + x / VJ) ** M


class RevTime:
    def __init__(self, TT_min: float, TT_max: float) -> None:
        self.TT = Model(TT_min, TT_max)

    def calculate(self, p: list[float], x: ndarray) -> ndarray:
        TT = self.TT.calculateModel(p[0])
        return TT * ln(1 + x)


class Optimizer:
    def __init__(self, model) -> None:
        self.model = model

    def func(self, p: list[float], x: float, y: float) -> float:
        return self.model.calculate(p, x) - y

    def run(self, x: ndarray, y: ndarray, c0: ndarray, ftol: float = 1e-8, xtol: float = 1e-8, gtol: float = 1e-8) -> least_squares:
        return least_squares(self.func, c0, args=(x, y), ftol=ftol, xtol=xtol, gtol=gtol)


def prepare_vach(If: list[float], Vf: list[float]) -> dict:
    
    # If = [0.1, 0.8, 2.5, 5.0, 7.0]
    # Vf = [0.8, 0.9, 1.0, 1.1, 1.2]
    If = array(If)
    Vf = array(Vf)
    print("diode_squares -> prepare_vach", "if: ", If, "Vf: ", Vf)
    c0 = array([RSinit, Ninit, ISinit])
    model_vach = ModelVach(RSmin, RSmax, Nmin, Nmax, ISmin, ISmax)
    optimizer_vach = Optimizer(model_vach)
    b = optimizer_vach.run(If, Vf, c0, 1e-8, 1e-8, 1e-8)
    RS = Model(RSmin, RSmax).calculateModel(b.x[0])
    N = Model(Nmin, Nmax).calculateModel(b.x[1])
    IS = Model(ISmin, ISmax).calculateModel(b.x[2])
    Vf_opt = model_vach.calculate(b.x, If)
    return {'RS': RS, 'IS': IS, 'N': N, 'Vf_opt': Vf_opt.tolist()}


def prepare_cap(C: list[float], Vr: list[float]) -> dict:
    # C = [0.87, 0.85, 0.835, 0.83, 0.823, 0.818, 0.8125]
    # Vr = [0, 1, 2, 3, 7, 10, 14]
    C = array(C)
    Vr = array(Vr)
    m0 = array([Minit, VJinit, CJ0init])
    model_cap = ModelCap(Mmin, Mmax, VJmin, VJmax, CJ0min, CJ0max)
    optimizer_cap = Optimizer(model_cap)
    b = optimizer_cap.run(Vr, C, m0, 1e-8, 1e-8, 1e-8)
    M = Model(Mmin, Mmax).calculateModel(b.x[0])
    VJ = Model(VJmin, VJmax).calculateModel(b.x[1])
    CJ0 = Model(CJ0min, CJ0max).calculateModel(b.x[2])
    C_opt = model_cap.calculate(b.x, Vr)
    return {'M': M, 'CJ0': CJ0, 'VJ': VJ, 'C_opt': C_opt.tolist()}


def prepare_rev(Trr: list[float], Ir: list[float]) -> dict:
    # Trr = [3, 2.25, 1.5]
    # Ir = [15e-3, 35e-3, 55e-3]
    Trr = array(Trr)
    Ir = array(Ir)
    Ifrv = 10e-3
    m0 = array([TTinit])
    I_ratio = Ifrv / Ir
    model_rev = RevTime(TTmin, TTmax)
    optimizer_rev = Optimizer(model_rev)
    b = optimizer_rev.run(I_ratio, Trr, m0, 1e-8, 1e-8, 1e-8)
    TT = Model(TTmin, TTmax).calculateModel(b.x[0])
    Trr_opt = model_rev.calculate(b.x, I_ratio)
    return {'TT': TT, 'Trr_opt': Trr_opt.tolist()}


def prepare_temp(Temp: list[float], It: list[float]) -> dict:
    # Temp = [25, 150]
    # It = [3e-6, 300e-6]
    Temp = array(Temp)
    It = array(It)
    Temp = Temp + 273.15
    XTI = (Ntemp * ln(It[1] / It[0]) - q * EG * (1 / Temp[0] - 1 / Temp[1]) / k) / ln(Temp[1] / Temp[0])
    return {'XTI': XTI}
