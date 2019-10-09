Axiom Timeseries Chart


Installation
------------

``npm install``

Updates to github dependencies (erddap-timeseries-chart and erddap-parser) require:

``npm update``

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


STORYBOOK
---------

This repository has a set of [storybook](//storybook.js.org) stories with live examples. To run a live storybook server:

```
$ npm run storybook
```

and open your browser to http://localhost:33333 if it doesn't automatically open.

NOTES
-----

For updates to get picked up by erddap-realtime-app:

- Bump package version
- Run ``npm update`` from erddap-realtime-app
- Would be fixed by using NPM to publish this
