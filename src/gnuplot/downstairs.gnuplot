set datafile separator ','
set term pngcairo size 400,250
set output output
set tics font "Helvetica,9"
#set tics textcolor rgb 'white'
set xtics rotate by 90 right
set lmargin 3
set rmargin 0.5
set tmargin 0.5
set bmargin 2.5
#set for [i=1:8] linetype i dashtype 3
set style line 1 lt 2 lw lineWidth lc rgb 'blue'
set style line 6 lt 2 lw 1 lc rgb 'white'
set ytics 2
#set grid xtics ytics ls 6
set xdata time
#set timefmt "%Y-%m-%dT%H:%M:%S"
set timefmt "%Y-%m-%d %H:%M:%S"
set format x "%H:%M"
set xtics 3600
#set tics scale 0
#unset border
#unset ytics
#unset xtics
#unset mytics
#unset mxtics
plot input using 1:2 with lines notitle ls 6, \
    input using 1:3 with lines notitle ls 1, \
    input using 1:4 with lines notitle ls 6
