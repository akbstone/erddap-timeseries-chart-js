Axiom Timeseries Chart


Installation
------------

``npm install``


Dependencies
------------


Examples
---

Create timeseries chart:

```

```

Create timeseries and QC chart:

```


```


Create QC-only chart:

```

```

Create curtain plot:

```

```


API
---

- ``data(arr)``
- ``x(fn)``
- ``y(fn)``
- ``width(number)``
- ``height(number)``
- ``xLabel(str)``
- ``yLabel(str)``
- ``qcOptions(arr)``
	- qc_option: ``{code:4,color:#FF0000,label:'Fail'}``

- ``drawLine``
- ``drawQc``
- ``drawCurtain``
- ``getDataAtX``
- ``getDataAtXY``
